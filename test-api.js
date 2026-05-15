// Test script to verify backend API is working
const http = require('http');

console.log('Testing backend API connection...\n');

// Test health endpoint
console.log('1. Testing health endpoint...');
const healthOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/health',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const healthReq = http.request(healthOptions, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Response: ${data}`);
    
    if (res.statusCode === 200) {
      console.log('   ✅ Health check passed!\n');
      
      // Test contact endpoint
      testContactEndpoint();
    } else {
      console.log('   ❌ Health check failed');
      process.exit(1);
    }
  });
});

healthReq.on('error', (error) => {
  console.log('   ❌ Cannot connect to backend:', error.message);
  console.log('\n   Make sure backend is running:');
  console.log('   cd backend');
  console.log('   npm run simple');
  process.exit(1);
});

healthReq.end();

// Test contact endpoint
function testContactEndpoint() {
  console.log('2. Testing contact endpoint...');
  
  const contactData = JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    website: '1',
    branding: '0',
    ecommerce: '0',
    seo: '0',
    message: 'This is a test message from API test'
  });
  
  const contactOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/contact',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(contactData)
    }
  };
  
  const contactReq = http.request(contactOptions, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   Response: ${data}`);
      
      if (res.statusCode === 200) {
        const result = JSON.parse(data);
        if (result.success) {
          console.log('   ✅ Contact endpoint working!\n');
          console.log('🎉 Backend API is fully functional!');
          console.log('\nNext steps:');
          console.log('1. Open index.html in your browser');
          console.log('2. Fill out the contact form');
          console.log('3. Check browser console (F12) for details');
        } else {
          console.log('   ❌ Contact endpoint returned error');
        }
      } else {
        console.log('   ❌ Contact endpoint failed');
      }
    });
  });
  
  contactReq.on('error', (error) => {
    console.log('   ❌ Cannot connect to contact endpoint:', error.message);
  });
  
  contactReq.write(contactData);
  contactReq.end();
}