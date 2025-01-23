const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const docusignEsignatureRouter = require('./routes/docusign/esignature.js');
const docusignAuthRouter = require('./routes/docusign/authentication.js');
const docusignClickRouter = require('./routes/docusign/click.js');

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

app.use(session({
  secret: 'mxioidjioas',
  resave: true,
  saveUninitialized: true
}));

// Routes
app.get('/', (req, res) => {return res.json({success: 'All Ok'})});
app.use('/api/docusign/esign', docusignEsignatureRouter);
app.use('/api/docusign/auth', docusignAuthRouter);
app.use('/api/docusign/click', docusignClickRouter);

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
