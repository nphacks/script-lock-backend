const express = require('express');
const router = express.Router();
const docusignClick = require("docusign-click");
const ClickService = require('../../services/clickService');

// Integrate Click API functionality
/**
 * Consent to standard agreement terms with a single click: terms and conditions, terms of use, privacy policies
 */

// Note: The developer and production endpoints for most Docusign APIs use slightly different paths. 

router.post('/upload-agreement-terms-of-use', async (req, res) => {
    try {
        const displaySettings = docusignClick.DisplaySettings.constructFromObject({
            consentButtonText: 'I Agree',
            displayName: 'Terms of Use',
            downloadable: true,
            format: 'modal',
            hasAccept: true,
            mustRead: true,
            requireAccept: true,
            documentDisplay: 'document',
        });
        return res.send(await ClickService.uploadAgreementTermsOfUse(req, displaySettings))
    } catch (error) {
        console.error('Full error details:', {
            message: error.message,
            // data: error.response?.data,
            status: error.response?.status
        });
        res.status(500).json({ error: 'Failed to create' });
    }
});
    

module.exports = router;