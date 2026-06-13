const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow frontend to talk to this backend
app.use(cors());

// Allow the server to read JSON data
app.use(express.json());

// Test route — visit this to confirm server is working
app.get('/', (req, res) => {
  res.json({ message: 'AI PDF Chat backend is running!' });
});

// Import routes (we'll create these next)
const uploadRoute = require('./routes/upload');
const chatRoute = require('./routes/chat');

app.use('/upload', uploadRoute);
app.use('/chat', chatRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});