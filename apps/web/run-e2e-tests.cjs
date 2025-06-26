#!/usr/bin/env node

/**
 * E2E Test Runner with Dynamic Port Detection
 * 
 * This script:
 * 1. Spawns the Vite dev server
 * 2. Detects the actual port it's running on
 * 3. Updates Playwright config dynamically
 * 4. Runs E2E tests
 * 5. Cleans up processes
 * 
 * Purpose: Solves the port mismatch issue where Vite increments ports
 * and Playwright targets the wrong port, causing test timeouts.
 */

const { spawn, execSync } = require('child_process');
const { writeFileSync, readFileSync } = require('fs');
const path = require('path');

class E2ETestRunner {
  constructor() {
    this.viteProcess = null;
    this.detectedPort = null;
    this.configPath = path.join(__dirname, 'playwright.config.js');
    this.originalConfig = null;
  }

  async start() {
    console.log('🚀 Starting E2E Test Runner with Dynamic Port Detection');
    console.log('=' .repeat(60));
    
    try {
      // Step 1: Backup original config
      await this.backupConfig();
      
      // Step 2: Start Vite dev server and detect port
      await this.startViteAndDetectPort();
      
      // Step 3: Update Playwright config with detected port
      await this.updatePlaywrightConfig();
      
      // Step 4: Run E2E tests
      await this.runE2ETests();
      
      console.log('✅ E2E Test Runner completed successfully');
      
    } catch (error) {
      console.error('❌ E2E Test Runner failed:', error.message);
      process.exit(1);
    } finally {
      // Step 5: Cleanup
      await this.cleanup();
    }
  }

  async backupConfig() {
    console.log('📋 Backing up original Playwright config...');
    this.originalConfig = readFileSync(this.configPath, 'utf8');
  }

  async startViteAndDetectPort() {
    console.log('🔍 Starting Vite dev server and detecting port...');
    
    return new Promise((resolve, reject) => {
      this.viteProcess = spawn('pnpm', ['dev'], {
        cwd: __dirname,
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      });

      let output = '';
      let portDetected = false;

      const timeout = setTimeout(() => {
        if (!portDetected) {
          console.error('\n[DEBUG] Vite output before timeout:\n' + output);
          this.viteProcess.kill();
          reject(new Error('Failed to detect Vite dev server port within 30 seconds'));
        }
      }, 30000);

      this.viteProcess.stdout.on('data', (data) => {
        const chunk = data.toString();
        output += chunk;
        process.stdout.write(chunk); // Show Vite output
        
        // Debug: log each chunk
        console.log('[CHUNK]', JSON.stringify(chunk));
        
        // Normalize chunk
        const normalized = chunk.replace(/\r|\n/g, '').trim();
        
        // Remove ANSI escape codes
        const ansiStripped = normalized.replace(/\u001b\[[0-9;]*m/g, '');
        // Parse for port number in ansiStripped chunk
        const portMatch = ansiStripped.match(/localhost:(\d+)/);
        if (portMatch && !portDetected) {
          this.detectedPort = parseInt(portMatch[1]);
          portDetected = true;
          clearTimeout(timeout);
          
          console.log(`\n🎯 Detected Vite dev server on port: ${this.detectedPort}`);
          
          // Wait a bit for server to be fully ready
          setTimeout(() => resolve(), 2000);
        }
      });

      this.viteProcess.stderr.on('data', (data) => {
        const chunk = data.toString();
        output += chunk;
        process.stderr.write(chunk); // Show Vite errors
      });

      this.viteProcess.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });

      this.viteProcess.on('exit', (code) => {
        if (code !== 0 && !portDetected) {
          clearTimeout(timeout);
          reject(new Error(`Vite process exited with code ${code}`));
        }
      });
    });
  }

  async updatePlaywrightConfig() {
    console.log(`⚙️  Updating Playwright config to use port ${this.detectedPort}...`);
    
    const dynamicConfig = `
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:${this.detectedPort}',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:${this.detectedPort}',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      VITE_APP_ENV: 'test',
      VITE_AUTH0_DOMAIN: 'test.auth0.com',
      VITE_AUTH0_CLIENT_ID: 'test_client_id',
      VITE_AUTH0_AUDIENCE: 'https://test.api.alphaframe.dev',
      VITE_PLAID_CLIENT_ID: 'test_plaid_client_id',
      VITE_PLAID_SECRET: 'test_plaid_secret',
      VITE_PLAID_ENV: 'sandbox'
    }
  },
});
`;

    writeFileSync(this.configPath, dynamicConfig);
    console.log('✅ Playwright config updated successfully');
  }

  async runE2ETests() {
    console.log('🧪 Running E2E tests...');
    
    return new Promise((resolve, reject) => {
      const testProcess = spawn('npx', ['playwright', 'test'], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true
      });

      testProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ E2E tests completed successfully');
          resolve();
        } else {
          console.error(`❌ E2E tests failed with exit code ${code}`);
          reject(new Error(`E2E tests failed with exit code ${code}`));
        }
      });

      testProcess.on('error', (error) => {
        reject(error);
      });
    });
  }

  async cleanup() {
    console.log('🧹 Cleaning up...');
    
    // Restore original config
    if (this.originalConfig) {
      writeFileSync(this.configPath, this.originalConfig);
      console.log('✅ Original Playwright config restored');
    }
    
    // Kill Vite process if still running
    if (this.viteProcess && !this.viteProcess.killed) {
      this.viteProcess.kill();
      console.log('✅ Vite dev server stopped');
    }
  }
}

// Run the test runner
if (require.main === module) {
  const runner = new E2ETestRunner();
  runner.start().catch((error) => {
    console.error('Fatal error in E2E Test Runner:', error);
    process.exit(1);
  });
}

module.exports = E2ETestRunner; 