const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');
const { Pool } = require('pg');
const config = require('../config');

let pool = null;
let sqliteDb = null;
let activeMode = null; // 'postgresql' | 'fallback'
let isInitialized = false;
let initError = null;

/**
 * Maps Postgres-style $1, $2 placeholders to SQLite ? placeholders
 * preserving the exact index ordering of the parameters.
 */
function prepareSqliteQuery(sql, params = []) {
  const orderedParams = [];
  const transformedSql = sql.replace(/\$(\d+)/g, (_, match) => {
    const idx = parseInt(match, 10) - 1;
    let paramVal = params[idx];
    if (paramVal !== undefined && typeof paramVal === 'object' && paramVal !== null && !(paramVal instanceof Date)) {
      paramVal = JSON.stringify(paramVal);
    } else if (paramVal instanceof Date) {
      paramVal = paramVal.toISOString();
    } else if (typeof paramVal === 'boolean') {
      paramVal = paramVal ? 1 : 0;
    }
    orderedParams.push(paramVal);
    return '?';
  });
  return { sql: transformedSql, params: orderedParams };
}

/**
 * Initialize Database Connection
 * Tries PostgreSQL first. If unavailable, falls back to native SQLite.
 */
async function initDb(options = {}) {
  if (isInitialized && !options.forceReconnect) {
    return { mode: activeMode };
  }

  const forceFallback = config.useDbFallback === 'always' || options.forceFallback;

  if (!forceFallback && config.databaseUrl) {
    try {
      pool = new Pool({
        connectionString: config.databaseUrl,
        connectionTimeoutMillis: 1500,
        idleTimeoutMillis: 10000,
        max: 10,
      });

      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();

      activeMode = 'postgresql';
      isInitialized = true;
      initError = null;
      console.log(`[StoreGrid DB] Successfully connected to PostgreSQL.`);
      return { mode: activeMode };
    } catch (err) {
      initError = err.message;
      if (pool) {
        try {
          await pool.end();
        } catch (_) {}
        pool = null;
      }
      console.warn(`[StoreGrid DB] PostgreSQL is not reachable (${err.message}).`);
    }
  }

  // Activate SQLite fallback
  try {
    activeMode = 'fallback';
    let dbPath = ':memory:';

    if (config.nodeEnv !== 'test' && !options.inMemory) {
      const dataDir = path.join(__dirname, '../../data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      dbPath = path.join(dataDir, 'storegrid_dev.sqlite');
    }

    sqliteDb = new DatabaseSync(dbPath);
    sqliteDb.exec('PRAGMA foreign_keys = ON;');

    // Load and run initial SQLite schema
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema-sqlite.sql'), 'utf-8');
    sqliteDb.exec(schemaSql);

    // Ensure batch_id column exists on feedback table for existing SQLite databases
    try {
      sqliteDb.exec('ALTER TABLE feedback ADD COLUMN batch_id TEXT;');
    } catch (_) {}
    try {
      sqliteDb.exec('CREATE INDEX IF NOT EXISTS idx_feedback_batch_id ON feedback(batch_id);');
    } catch (_) {}

    isInitialized = true;
    console.log(
      `[StoreGrid DB] NOTICE: Running in DEVELOPMENT_FALLBACK mode (SQLite: ${dbPath}). PostgreSQL is not running locally.`
    );
    return { mode: activeMode };
  } catch (err) {
    console.error(`[StoreGrid DB] Failed to initialize SQLite fallback:`, err);
    throw err;
  }
}

/**
 * Unified SQL Query Execution
 * Supports both PostgreSQL and SQLite fallback transparently.
 */
async function query(sqlText, params = []) {
  if (!isInitialized) {
    await initDb();
  }

  if (activeMode === 'postgresql' && pool) {
    const res = await pool.query(sqlText, params);
    return {
      rows: res.rows,
      rowCount: res.rowCount,
    };
  }

  if (activeMode === 'fallback' && sqliteDb) {
    const { sql, params: sqliteParams } = prepareSqliteQuery(sqlText, params);
    const trimmed = sql.trim();
    const isSelect = /^SELECT/i.test(trimmed);
    const hasReturning = /RETURNING\b/i.test(trimmed);

    try {
      const stmt = sqliteDb.prepare(sql);
      if (isSelect || hasReturning) {
        const rows = stmt.all(...sqliteParams);
        // Normalize rows (converting prototype, dates, booleans if needed)
        const normalizedRows = rows.map((row) => {
          const plain = { ...row };
          return plain;
        });
        return {
          rows: normalizedRows,
          rowCount: normalizedRows.length,
        };
      } else {
        const result = stmt.run(...sqliteParams);
        return {
          rows: [],
          rowCount: Number(result.changes),
        };
      }
    } catch (err) {
      console.error(`[StoreGrid DB Error] Failed executing SQLite query:`, sql, sqliteParams, err.message);
      throw err;
    }
  }

  throw new Error('Database is not initialized.');
}

/**
 * Returns current database health and mode metadata
 */
function getDbStatus() {
  return {
    connected: isInitialized,
    mode: activeMode || 'uninitialized',
    isFallback: activeMode === 'fallback',
    limitationNotice:
      activeMode === 'fallback'
        ? 'Running with local SQLite relational fallback. PostgreSQL is not reachable locally. Set DATABASE_URL and run migrations for production deployment.'
        : null,
    error: initError,
  };
}

/**
 * Gracefully close database connections
 */
async function closeDb() {
  if (pool) {
    await pool.end();
    pool = null;
  }
  if (sqliteDb) {
    try {
      sqliteDb.close();
    } catch (_) {}
    sqliteDb = null;
  }
  isInitialized = false;
  activeMode = null;
}

module.exports = {
  initDb,
  query,
  getDbStatus,
  closeDb,
};
