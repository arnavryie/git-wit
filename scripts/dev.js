#!/usr/bin/env node
/**
 * git-wit Unified Dev Runner
 * Runs Next.js Web app and Expo Android simultaneously with a single command.
 */

const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'apps', 'frontend');
const mobileDir = path.join(rootDir, 'apps', 'mobile');

// ANSI Color codes for clean simultaneous log output
const BLUE = '\x1b[34m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

console.log(`${BOLD}⚔️ Starting git-wit: Web + Android simultaneously...${RESET}\n`);

// 1. Start Next.js Frontend Server
const web = spawn('npm', ['run', 'dev'], {
  cwd: frontendDir,
  shell: true,
  stdio: 'pipe',
  env: { ...process.env, PORT: '3000' },
});

web.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach((line) => {
    if (line) console.log(`${BLUE}[WEB]${RESET} ${line}`);
  });
});

web.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach((line) => {
    if (line) console.error(`${BLUE}[WEB:ERR]${RESET} ${line}`);
  });
});

// 2. Start Expo Android Dev Runner
const android = spawn('npm', ['run', 'android'], {
  cwd: mobileDir,
  shell: true,
  stdio: 'pipe',
  env: { ...process.env },
});

android.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach((line) => {
    if (line) console.log(`${GREEN}[ANDROID]${RESET} ${line}`);
  });
});

android.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach((line) => {
    if (line) console.error(`${GREEN}[ANDROID:ERR]${RESET} ${line}`);
  });
});

// Cleanup handler on exit or Ctrl+C
const cleanup = () => {
  console.log(`\n${BOLD}Shutting down git-wit web and Android processes...${RESET}`);
  try {
    web.kill('SIGINT');
  } catch {}
  try {
    android.kill('SIGINT');
  } catch {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
