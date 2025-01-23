// services/documentGenerationService.js
const docusign = require('docusign-esign');
const PDFDocument = require('pdfkit');

class DocumentGenerationService {
    async generateDocument(agreementData) {
        // Create document object
        const doc = new docusign.Document();
        
        // Generate PDF content
        const pdfBuffer = await this.createPDFContent(agreementData);
        
        // Convert to base64
        const documentBase64 = pdfBuffer.toString('base64');
        
        // Set document properties
        doc.documentBase64 = documentBase64;
        doc.name = 'Upload Agreement.pdf';
        doc.fileExtension = 'pdf';
        doc.documentId = '1';

        return doc;
    }

    async createPDFContent(agreementData) {
        return new Promise((resolve) => {
            const chunks = [];
            const doc = new PDFDocument();
            
            // Collect PDF chunks
            doc.on('data', chunks.push.bind(chunks));
            doc.on('end', () => {
                const result = Buffer.concat(chunks);
                resolve(result);
            });

            // Generate PDF content
            this.addHeaderSection(doc, agreementData);
            this.addCreatorSection(doc, agreementData);
            this.addIPContentSection(doc, agreementData);
            this.addRoyaltySection(doc, agreementData);
            this.addSignatureSection(doc);

            doc.end();
        });
    }

    addHeaderSection(doc, data) {
        doc.fontSize(16).text('Intellectual Property Upload Agreement', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
        doc.moveDown();
    }

    addCreatorSection(doc, data) {
        doc.fontSize(14).text('1. Creator Information');
        doc.fontSize(12)
           .text(`Name: ${data.creatorName}`)
           .text(`Contact Details: ${data.contactDetails}`);
        doc.moveDown();
    }

    addIPContentSection(doc, data) {
        doc.fontSize(14).text('2. IP Content Details');
        doc.fontSize(12)
           .text(`Title: ${data.workTitle}`)
           .text(`Description: ${data.description}`)
           .text(`IPFS Hash: ${data.ipfsHash}`)
           .text(`Metadata: ${data.metadata}`);
        doc.moveDown();
    }

    addRoyaltySection(doc, data) {
        doc.fontSize(14).text('4. Royalty Payment Terms');
    
        const table = {
            headers: ['Term', 'Percentage', 'Frequency', 'Usage Terms'],
            rows: data.royaltyTerms.map((term, index) => [
                `Term ${index + 1}`,
                `${term.percentage}%`,
                term.frequency,
                term.usageTerms
            ])
        };
    
        doc.table(table, { width: 500 });
    }
    

    addSignatureSection(doc) {
        doc.moveDown();
        doc.fontSize(12).text('Signature: /sn1/', { align: 'left' });
        doc.moveDown();
        doc.text('Date: /signatureDate/', { align: 'left' });
    }
}

module.exports = DocumentGenerationService;
