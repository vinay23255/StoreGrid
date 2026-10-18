const { spawn } = require('child_process');
const path = require('path');

console.log('=======================================================');
console.log(' Starting StoreGrid Fullstack Services (Frontend + Backend)');
console.log('=======================================================');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// 1. Start Backend Express Server
const backend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve(__dirname, '..'),
  stdio: 'pipe',
  shell: true,
  env: { ...process.env, PORT: '5000' },
});

backend.stdout.on('data', (data) => {
  process.stdout.write(`[StoreGrid Backend] ${data}`);
});

backend.stderr.on('data', (data) => {
  process.stderr.write(`[StoreGrid Backend ERR] ${data}`);
});

// 2. Start Frontend Vite Server
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve(__dirname, '../frontend'),
  stdio: 'pipe',
  shell: true,
  env: { ...process.env, VITE_API_BASE_URL: 'http://localhost:5000' },
});

frontend.stdout.on('data', (data) => {
  process.stdout.write(`[StoreGrid Frontend] ${data}`);
});

frontend.stderr.on('data', (data) => {
  process.stderr.write(`[StoreGrid Frontend ERR] ${data}`);
});

// Handle exit
function cleanup() {
  console.log('\n[StoreGrid] Shutting down fullstack development servers...');
  try {
    backend.kill('SIGINT');
  } catch (_) {}
  try {
    frontend.kill('SIGINT');
  } catch (_) {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
