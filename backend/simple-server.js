const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - More permissive CORS for local development
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle pre-flight OPTIONS requests
app.options('*', cors());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend is running',
    port: PORT,
    time: new Date().toISOString()
  });
});

// Contact form endpoint (mock for testing)
app.post('/api/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  
  // Log request details for debugging
  console.log('Request headers:', req.headers);
  console.log('Request origin:', req.headers.origin);
  
  // Simulate processing delay
  setTimeout(() => {
    res.json({ 
      success: true, 
      message: 'Message received successfully! (This is a test response)',
      data: req.body,
      timestamp: new Date().toISOString()
    });
  }, 500);
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../'));
  
  // Handle SPA routing
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: '../' });
  });
}

// Start server with port fallback
function startServer(port, maxAttempts = 10) {
  const server = app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`🌐 Health check: http://localhost:${port}/api/health`);
    console.log(`📝 Contact endpoint: http://localhost:${port}/api/contact`);
    console.log(`📧 Email configured: ${process.env.EMAIL_USER ? 'Yes (test mode)' : 'No (mock mode)'}`);
    console.log(`\n💡 Frontend configuration:`);
    console.log(`   Update js/contact-form.js line 8 if needed:`);
    console.log(`   API_URL = 'http://localhost:${port}/api'`);
  });
  
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      if (nextPort <= port + maxAttempts) {
        console.log(`Port ${port} is busy, trying ${nextPort}...`);
        server.close();
        startServer(nextPort, maxAttempts);
      } else {
        console.error(`❌ Could not find available port after ${maxAttempts} attempts`);
        process.exit(1);
      }
    } else {
      console.error('Server error:', error);
    }
  });
}

// Start the server
startServer(PORT);