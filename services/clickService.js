const docusignClick = require("docusign-click");
const docusign = require('docusign-esign');

class ClickService {

    constructor() {
        this.dsApiClient = new docusignClick.ApiClient();
        this.apiClient = new docusign.ApiClient();
    }

    async uploadAgreementTermsOfUse(req, displaySettings) {
        try {
            this.dsApiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH);
            this.dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + req.session.access_token);    

            // const documentPdfExample = fs.readFileSync(termsData.docFile);
            const encodedExampleDocument = Buffer.from('This is a sample document').toString('base64');
            const document = docusignClick.Document.constructFromObject({
                documentBase64: encodedExampleDocument,
                documentName: 'Terms of Service',
                fileExtension: 'pdf',
                order: 0,
            });
        
            // Create clickwrapRequest model
            const clickwrapRequest = docusignClick.ClickwrapRequest.constructFromObject({
                displaySettings,
                documents: [document],
                name: req.clickwrapName,
                requireReacceptance: true,
            });

            console.log('Click wrap request: ', clickwrapRequest, req.session.access_token)

            const userInfo = await this.apiClient.getUserInfo(req.session.access_token);
            const accountId = userInfo.accounts[0].accountId;

            console.log('Account Id: ', accountId)

            const accountApi = new docusignClick.AccountsApi(dsApiClient);
            const result = await accountApi.createClickwrap(accountId, {
                clickwrapRequest,
            });
            return result.body;
        } catch (error) {
            console.error('Error creating terms of use');
            throw error;
        }
    }
}

module.exports = new ClickService();