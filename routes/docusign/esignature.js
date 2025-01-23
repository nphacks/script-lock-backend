const express = require('express');
const router = express.Router();
const envelopeService = require('../../services/envelopeService');

// Integrate eSignature REST API functionality
/**
 * Folders: Containers of Envelopes/Templates
 * Envelopes: Overall container - contains one or more documents, information about sender, recipients, tabs, status - Created individually or from Templates - Identified by ID
 * Documents: contained by envelopes
 * Recipients: specified by envelopes
 * Tabs: Places in document for recipient input (mostly signature)
 */

// Note to me: Implement Embeded signing for in-app signature + Setting tabs in HTML
// Note: The developer and production endpoints for most Docusign APIs use slightly different paths. 

router.post('/create-document', async (req, res) => {
  try {
    console.log('API Account ID:', process.env.DOCUSIGN_ACCOUNT_ID);
    console.log('Integration Key:', process.env.DOCUSIGN_INTEGRATION_KEY);

    const { documentData } = req.body;

    const envelope = await envelopeService.createEnvelope(req, documentData);
    console.log('Envelope created:', envelope);
    const signingUrl = await envelopeService.createSigningUrl(
        envelope.envelopeId,
        documentData.signerEmail,
        documentData.signerName,
        documentData.returnUrl
    );
    res.json({ envelopeId: envelope.envelopeId, signingUrl: signingUrl.url });
  } catch (error) {
    console.error('Full error details:', {
      message: error.message,
      data: error.response?.data,
      status: error.response?.status
    });
    res.status(500).json({ error: 'Failed to create' });
  }
});

module.exports = router;