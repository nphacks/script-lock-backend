const docusign = require("docusign-esign");
const DocumentGenerationService = require('./documentGenerationService');

class EnvelopeService {

    constructor() {
        this.dsApiClient = new docusign.ApiClient();
        this.documentGenerator = new DocumentGenerationService();
    }
     
    async createEnvelope(req, documentData) {
        try {
            
            this.dsApiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH);
            this.dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + req.session.access_token);

            const envelopeDefinition = new docusign.EnvelopeDefinition();
            envelopeDefinition.emailSubject = 'Please sign this document set';

            const document = await this.documentGenerator.generateDocument(documentData);

            //Sign Here
            let signHere1 = docusign.SignHere.constructFromObject({
                anchorString: '**signature_1**',
                anchorYOffset: '10',
                anchorUnits: 'pixels',
                anchorXOffset: '20',
            });

            // Create signer
            const signer = new docusign.Signer();
            signer.email = documentData.signerEmail;
            signer.name = documentData.signerName;
            signer.recipientId = '1';
            signer.clientUserId = '1001';
            let signerTabs = docusign.Tabs.constructFromObject({
                signHereTabs: [signHere1],
            });
            signer.tabs = signerTabs;

            // Add to envelope
            envelopeDefinition.documents = [document];
            envelopeDefinition.recipients = new docusign.Recipients();
            envelopeDefinition.recipients.signers = [signer];
            envelopeDefinition.status = 'sent';

            // Create envelope
            const envelopesApi = new docusign.EnvelopesApi(this.dsApiClient);

            //Add recipients
            let recipients = docusign.Recipients.constructFromObject({
                signers: [signer]
            });
            envelopeDefinition.recipients = recipients;

            return await envelopesApi.createEnvelope(
                process.env.DOCUSIGN_ACCOUNT_ID,
                { envelopeDefinition }
            );
        } catch (error) {
            console.error('Error creating envelope:');
            throw error;
        }
    }
}

module.exports = new EnvelopeService();