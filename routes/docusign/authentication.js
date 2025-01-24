const express = require('express');
const router = express.Router();
const accessTokenService = require('../../services/docusignAccessTokenService');

router.get('/', async (req, res) => {
    return res.send(await accessTokenService.checkToken(req))
});

// router.get('/consent', (req, res) => {
//     // const authUrl = `https://account.docusign.com/oauth/auth?response_type=code&scope=signature&client_id=${process.env.DOCUSIGN_INTEGRATION_KEY}&state=random_state_string&redirect_uri=${process.env.DOCUSIGN_REDIRECT_URI}`;
//     const authUrl = `https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=${process.env.DOCUSIGN_INTEGRATION_KEY}&redirect_uri=${process.env.DOCUSIGN_REDIRECT_URI}`
//     res.send(authUrl);
// });

// router.get('/callback', async (req, res) => {
//     console.log('Coming to callback')
// });

module.exports = router;

