const docusign = require('docusign-esign');

class DocusignAccessTokenService {

    async checkToken(req) {
        if (req.session.access_token && Date.now() < req.session.expired_at) {
            return { status: true, message: 'Access Token is active', access_token: req.session.access_token }
        } else {
            return await this.createAccessToken(req)
        }
    }

    async createAccessToken(req) {
        try {
            let dsApiClient = new docusign.ApiClient();
            dsApiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH);
            const results = await dsApiClient.requestJWTUserToken(
                process.env.DOCUSIGN_INTEGRATION_KEY,
                process.env.DOCUSIGN_USER_ID,
                "signature",
                process.env.DOCUSIGN_PRIVATE_KEY,
                3600
            );
            console.log(results.body)
            req.session.access_token = results.body.access_token
            req.session.expired_at = Date.now() + (results.body.expires_in - 60) * 1000
            console.log(req.session)
            return { status: true, message: 'Access Token created successfully', access_token: req.session.access_token }
        } catch(error) {
            return { status: false, message: 'Error creating Access Token' }
        }
    }
}

module.exports = new DocusignAccessTokenService();