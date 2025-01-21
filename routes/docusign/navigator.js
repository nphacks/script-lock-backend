const express = require('express');
const router = express.Router();
const axios = require('axios');

// Integrate Navigator API functionality
/**
 * AI-extracted data - analyze existing agreements, extract insights and connect agreement data to business systems
 * Agreement: Commitment between two parties
 * Document: Artifacts, an agreement's documents are stored in Docusign Navigator and AI insights are drawn from it
 * Parties: People, entity or group involved in agreement
 * AI insights: Navigator helps to analyze documents uploaded to Docusign Navigator
 * Category and type: Agreement's categody and type
 * Provisions: Agreenebt parameters
 */

//Fetching an agreement for an account
router.get('/accounts/:accountId/agreements/:agreementId', async (req, res) => {
    try {
        const { accountId, agreementId } = req.params;

        const headers = {
            'Authorization': `Bearer ${process.env.NAVIGATOR_API_ACCESS_TOKEN}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        
        // Make the request using axios
        const response = await axios({
            method: 'GET',
            url: `${process.env.BASE_PATH}/accounts/${accountId}/agreements/${agreementId}`,
            headers: headers
        });

        // Send back the response data
        res.status(response.status).json(response.data);

    } catch (error) {
        console.error('Error fetching agreement:', error);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || 'Internal Server Error'
        });
    }
});

module.exports = router;