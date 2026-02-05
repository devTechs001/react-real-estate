import axios from 'axios';

console.log('Testing if the server is accessible...');

try {
  const response = await axios.get('http://localhost:5000');
  console.log('✅ Server is accessible:', response.data.message);
  
  // Test if Socket.IO endpoint is accessible
  console.log('\nTesting Socket.IO endpoint...');
  try {
    const socketResponse = await axios.get('http://localhost:5000/socket.io/');
    console.log('❌ Unexpected: Socket.IO responded with data instead of upgrading to WebSocket');
  } catch (socketError) {
    if (socketError.response && socketError.response.status === 400) {
      console.log('✅ Socket.IO endpoint is accessible (expected 400 for HTTP GET)');
    } else {
      console.log('❓ Socket.IO endpoint response:', socketError.message);
    }
  }
} catch (error) {
  console.error('❌ Error connecting to server:', error.message);
}