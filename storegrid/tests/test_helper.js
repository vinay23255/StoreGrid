const http = require('http');
const app = require('../src/app');
const db = require('../src/db');
const storeService = require('../src/services/store.service');

let server = null;
let baseUrl = '';

/**
 * Start test server on random available port with an in-memory SQLite database
 */
async function setupTestServer() {
  process.env.NODE_ENV = 'test';
  await db.initDb({ inMemory: true, forceFallback: true });

  // Provision base test store
  await storeService.findOrCreateStore({
    storeIdOrCode: 'TEST-STR-01',
    defaultName: 'Test Store Alpha',
    region: 'Test Region',
    city: 'Test City',
  });

  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve({ server, baseUrl });
    });
  });
}

async function teardownTestServer() {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
    server = null;
  }
  await db.closeDb();
}

function getBaseUrl() {
  return baseUrl;
}

module.exports = {
  setupTestServer,
  teardownTestServer,
  getBaseUrl,
};
