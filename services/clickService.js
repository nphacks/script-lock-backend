const docusignClick = require("docusign-click");
const userService = require('./userService');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

class ClickService {

    constructor() {
        this.dsApiClient = new docusignClick.ApiClient();
    }

    async uploadAgreementTermsOfUse(req, displaySettings) {
        try {
            this.dsApiClient.setBasePath(process.env.DOCUSIGN_CLICK_API_BASE_PATH);
            this.dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + req.session.access_token);    
            const filePath = path.resolve(__dirname, 'TermsOfService.pdf');
            const documentPdfExample = fs.readFileSync(filePath);
            const encodedExampleDocument = Buffer.from(documentPdfExample).toString('base64');
            const document = docusignClick.Document.constructFromObject({
                documentBase64: encodedExampleDocument,
                documentName: 'Upload Agreement Terms of Service',
                fileExtension: 'pdf',
                order: 0,
            });
            // Create clickwrapRequest model
            const clickwrapRequest = docusignClick.ClickwrapRequest.constructFromObject({
                displaySettings,
                documents: [document],
                name: req.body.clickwrapName,
                requireReacceptance: true,
                status: "draft"
            });

            // console.log('Click wrap request: ', clickwrapRequest)
            
            const userInfo = await userService.getUserInfo(req.session.access_token);
            const accountId = userInfo.accounts[0].account_id;
            const accountApi = new docusignClick.AccountsApi(this.dsApiClient);
            console.log(this.dsApiClient.defaultHeaders);
            console.log(`After Account API `);
            const result = await accountApi.createClickwrap(accountId, clickwrapRequest);
            console.log(`Clickwrap was created. ClickwrapId `);
            return result;
            
        } catch (error) {
            console.error('Error creating terms of use', error);
            console.error('Full error details:', {
                message: error.message,
                data: error.response?.data,
                status: error.response?.status
            });
        }
    }
}

module.exports = new ClickService();