const express = require('express');
const router = express.Router();

// Integrate eSignature REST API functionality
/**
 * Folders: Containers of Envelopes/Templates
 * Envelopes: Overall container - contains one or more documents, information about sender, recipients, tabs, status - Created individually or from Templates - Identified by ID
 * Documents: contained by envelopes
 * Recipients: specified by envelopes
 * Tabs: Places in document for recipient input (mostly signature)
 */

// Note to me: Implement Embeded signing for in-app signature + Setting tabs in HTML

/**
 * ===> What all can be done?
 * Search for envelopes
 * Envelopes locking
 * List, move, share and search folders
 * Envelope status codes
 * Document generation
 * Attachments (signer or envelope attachment)
 */

// Note: The developer and production endpoints for most Docusign APIs use slightly different paths. 

// GET all 
router.get('/', (req, res) => {
  // This is just an example response
  res.json({
    users: [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' }
    ]
  });
});

// GET single 
router.get('/:id', (req, res) => {
  const id = req.params.id;
  res.json({ id, name: 'John Doe' });
});

// POST new 
router.post('/', (req, res) => {
  const { name } = req.body;
  // Here you would typically save to a database
  res.status(201).json({ id: 3, name });
});

module.exports = router;
