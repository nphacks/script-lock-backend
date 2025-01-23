class UploadAgreement {
    constructor({
        creatorName,
        contactDetails,
        workTitle,
        description,
        ipfsHash,
        metadata,
        royaltyTerms
    }) {
        this.date = new Date().toISOString().split('T')[0];
        this.creatorName = creatorName;
        this.contactDetails = contactDetails;
        this.workTitle = workTitle;
        this.description = description;
        this.ipfsHash = ipfsHash;
        this.metadata = metadata;
        this.royaltyTerms = royaltyTerms;
    }
}

module.exports = UploadAgreement;