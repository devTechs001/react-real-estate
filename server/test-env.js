import dotenv from 'dotenv';
const result = dotenv.config();
console.log('Dotenv result:', result);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('Full MONGODB_URI value:', JSON.stringify(process.env.MONGODB_URI));
console.log('Full MONGO_URI value:', JSON.stringify(process.env.MONGO_URI));