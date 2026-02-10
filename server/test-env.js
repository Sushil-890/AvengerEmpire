/**
 * Test Environment Configuration
 * Run this to validate your .env setup before starting the server
 */

require('dotenv').config();
const validateEnv = require('./src/utils/validateEnv');

console.log('🔍 Testing Environment Configuration...\n');

try {
    validateEnv();
    console.log('\n✅ All checks passed! Your environment is configured correctly.');
    console.log('You can now start the server with: npm start\n');
    process.exit(0);
} catch (error) {
    console.error('\n❌ Environment validation failed!');
    console.error('Please fix the issues above and try again.\n');
    process.exit(1);
}
