const app = require('./app');
const config = require('./config');
const db = require('./db');

let server = null;

async function startServer() {
  try {
    console.log(`[StoreGrid] Bootstrapping server in ${config.nodeEnv} mode...`);

    // Initialize Database (PostgreSQL with SQLite fallback)
    await db.initDb();

    server = app.listen(config.port, () => {
      console.log(`=======================================================`);
      console.log(` StoreGrid Backend is listening on port ${config.port}`);
      console.log(` Health endpoint: http://localhost:${config.port}/api/health`);
      console.log(` Database Mode:   ${db.getDbStatus().mode.toUpperCase()}`);
      console.log(`=======================================================`);
    });

    // Graceful shutdown
    const handleShutdown = async (signal) => {
      console.log(`\n[StoreGrid] Received ${signal}. Gracefully shutting down...`);
      if (server) {
        server.close(async () => {
          console.log('[StoreGrid] HTTP server closed.');
          await db.closeDb();
          console.log('[StoreGrid] Database connection closed.');
          process.exit(0);
        });
      } else {
        await db.closeDb();
        process.exit(0);
      }
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  } catch (err) {
    console.error('[StoreGrid] Fatal error during startup:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = {
  startServer,
};
