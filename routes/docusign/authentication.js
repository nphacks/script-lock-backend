const express = require('express');
const router = express.Router();
const accessTokenService = require('../../services/docusignAccessTokenService');

router.get('/', async (req, res) => {
    return res.send(await accessTokenService.checkToken(req))
});


module.exports = router;