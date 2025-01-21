const express = require('express');
const cors = require('cors');
const esignatureRouter = require('./routes/docusign/esignature.js');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'], //Other allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {return res.json({success: 'All Ok'})});
app.use('/api/docusign/esign', esignatureRouter);

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
