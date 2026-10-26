#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const storefrontDir = path.join(__dirname, '..', 'apps', 'storefront');
const originalCwd = process.cwd();

try {
  process.chdir(storefrontDir);
  console.log('Running ESLint from storefront...');
  execSync('npx eslint --fix --max-warnings 0 src', { stdio: 'inherit' });
  console.log('Running Prettier from storefront...');
  execSync('npx prettier --write src', { stdio: 'inherit' });
  process.chdir(originalCwd);
} catch (error) {
  process.chdir(originalCwd);
  process.exit(error.status || 1);
}
