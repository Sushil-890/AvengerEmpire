// Run this script to test your connection
// Usage: node debug-connection.js

const axios = require('axios');

const testUrls = [
    'http://localhost:5000/api/test',
    'http://10.0.2.2:5000/api/test',
    'http://127.0.0.1:5000/api/test'
];

async function testConnection() {
    console.log('🔍 Testing server connections...\n');
    
    for (const url of testUrls) {
        try {
            console.log(`Testing: ${url}`);
            const response = await axios.get(url, { timeout: 5000 });
            console.log(`✅ SUCCESS: ${response.status} - ${response.data.message}\n`);
        } catch (error) {
            console.log(`❌ FAILED: ${error.message}\n`);
        }
    }
    
    console.log('💡 Tips:');
    console.log('- Make sure your server is running: npm start (in server folder)');
    console.log('- If using physical device, find your computer\'s IP address');
    console.log('- On Windows: ipconfig | findstr IPv4');
    console.log('- On Mac/Linux: ifconfig | grep inet');
}

testConnection();