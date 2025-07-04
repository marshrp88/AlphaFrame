/**
 * start-dev-server.js - Fixed Port Development Server
 * 
 * Purpose: Launch development server on a fixed port to prevent
 * port thrashing that breaks E2E tests.
 * 
 * Procedure:
 * 1. Kill any existing processes on port 5173
 * 2. Start Vite dev server on fixed port 5173
 * 3. Provide clear startup logging
 * 4. Handle graceful shutdown
 * 
 * Conclusion: Fixed port prevents E2E test connection failures.
 */

const { spawn } = require('child_process');
const { exec } = require('child_process');
const path = require('path');

const PORT = 5173;
const SERVER_URL = `http://localhost:${PORT}`;

console.log('🚀 Starting AlphaFrame Development Server...');
console.log(`📍 Fixed Port: ${PORT}`);
console.log(`🌐 Server URL: ${SERVER_URL}`);

// Kill any existing process on the port
function killPort(port) {
  return new Promise((resolve) => {
    exec(`npx kill-port ${port}`, (error) => {
      if (error) {
        console.log(`⚠️  No existing process on port ${port}`);
      } else {
        console.log(`✅ Killed existing process on port ${port}`);
      }
      resolve();
    });
  });
}

// Start the dev server
async function startServer() {
  try {
    // Kill any existing process on the port
    await killPort(PORT);
    
    // Wait a moment for port to be available
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('🔄 Starting Vite dev server...');
    
    // Start Vite with fixed port
    const viteProcess = spawn('npx', ['vite', '--port', PORT.toString()], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      shell: true
    });
    
    // Handle process events
    viteProcess.on('error', (error) => {
      console.error('❌ Failed to start dev server:', error);
      process.exit(1);
    });
    
    viteProcess.on('exit', (code) => {
      console.log(`🔚 Dev server exited with code ${code}`);
      process.exit(code);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down dev server...');
      viteProcess.kill('SIGINT');
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down dev server...');
      viteProcess.kill('SIGTERM');
    });
    
  } catch (error) {
    console.error('❌ Error starting dev server:', error);
    process.exit(1);
  }
}

// Start the server
startServer(); 