import axios from 'axios';

console.log('Testing CORS configuration...');

try {
  // Test with the correct origin
  const response = await axios.get('http://localhost:5000/', {
    headers: {
      'Origin': 'http://localhost:5174'
    }
  });
  console.log('✅ Server responded successfully');
  console.log('Server message:', response.data.message);
} catch (error) {
  console.error('❌ Error:', error.message);
  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Headers:', error.response.headers);
  }
}