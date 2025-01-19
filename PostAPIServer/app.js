require('dotenv').config();
const cors = require('cors');

const express = require('express');
const mongoose = require('./config/mongoose-config'); // Your database connection
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware

// const corsOptions = {
//     origin: 'http://localhost:3000', // Allow only this origin
//   };
//  app.use(cors(corsOptions));
  
app.use(cors()); // Allow all origins, or specify a list of allowed origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.use('/api/posts', postRoutes);
app.use('/api/user',userRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/check', (req, res) => {
    res.send('ok');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
