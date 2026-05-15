// Simple test to verify server starts
const { spawn } = require('child_process');
const http = require('http');

console.log('Testing backend server...');

// Start the server
const serverProcess = spawn('node', ['server.js'], {
  env: { ...process.env, PORT: 3002, NODE_ENV: 'test' },
  stdio: 'pipe'
});

let serverOutput = '';
let serverError = '';

serverProcess.stdout.on('data', (data) => {
  serverOutput += data.toString();
  console.log('Server output:', data.toString());
});

serverProcess.stderr.on('data', (data) => {
  serverError += data.toString();
  console.error('Server error:', data.toString());
});

// Wait for server to start
setTimeout(() => {
  console.log('\n--- Testing health endpoint ---');
  
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/health',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response status:', res.statusCode);
      console.log('Response body:', data);
      
      if (res.statusCode === 200) {
        console.log('✅ Health check passed!');
      } else {
        console.log('❌ Health check failed');
      }
      
      // Kill server process
      serverProcess.kill();
      process.exit(res.statusCode === 200 ? 0 : 1);
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
    serverProcess.kill();
    process.exit(1);
  });

  req.on('timeout', () => {
    console.error('❌ Request timeout');
    req.destroy();
    serverProcess.kill();
    process.exit(1);
  });

  req.end();
}, 3000);

// Handle process exit
process.on('exit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});