const express = require('express');
const router = express.Router();
const axios = require('axios');

const docusignRooms = require('docusign-rooms');


// Integrate Rooms API functionality
/**
 * Sets requirements of each party by assigning roles to the people involved in the transaction.
 * Roles can be assigned tasks to comeplete 
 * Roles can have different levels of access
 */

// Note: The developer and production endpoints for most Docusign APIs use slightly different paths. 

router.post('/ip-content/room', ipContentRoomController.createController);
router.get('/ip-content/room/new', ipContentRoomController.getController);
router.put('/ip-content/room/:roomId/creator/:creatorId/role/:newRole', 
    ipContentRoomController.updateCreatorAccess);
router.get('/ip-content/room/:roomId', ipContentRoomController.getRoomDetails);

const DOCUSIGN_BASE_PATH = process.env.DOCUSIGN_ROOM_BASE_PATH;
const DOCUSIGN_ACCOUNT_ID = process.env.DOCUSIGN_ROOM_ACCOUNT_ID;

async function setupIPContentRoom(accessToken, roomData) {
    // Initialize DocuSign client
    const dsApiClient = new docusignRooms.ApiClient();
    dsApiClient.setBasePath(DOCUSIGN_BASE_PATH);
    dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);

    const roomsApi = new docusignRooms.RoomsApi(dsApiClient);

    // Create room with data
    const roomWithData = {
        body: {
            name: roomData.projectName,
            roleId: roomData.roleId, // You'll need to get this from DocuSign
            transactionSideId: 'sell', // Or appropriate type
            fieldData: {
                data: {
                    projectType: 'IP Content',
                    contentDescription: roomData.contentDescription,
                    contentOwner: roomData.contentOwner,
                    accessLevel: roomData.accessLevel
                }
            }
        }
    };

    try {
        const room = await roomsApi.createRoom(DOCUSIGN_ACCOUNT_ID, roomWithData, null);
        return room;
    } catch (error) {
        console.error('Error creating room:', error);
        throw error;
    }
}

// Controller functions
const ipContentRoomController = {
    createController: async (req, res) => {
        try {
            const { accessToken } = req; // You'll need to get this from your auth middleware
            const roomData = {
                projectName: req.body.projectName,
                contentDescription: req.body.contentDescription,
                contentOwner: req.body.contentOwner,
                accessLevel: req.body.accessLevel,
                roleId: req.body.roleId
            };

            const room = await setupIPContentRoom(accessToken, roomData);

            res.status(200).json({
                success: true,
                roomId: room.roomId,
                message: 'IP Content Room created successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create IP content room',
                error: error.message
            });
        }
    },

    getController: async (req, res) => {
        try {
            // Return form for room creation
            res.status(200).json({
                formFields: {
                    projectName: 'string',
                    contentDescription: 'string',
                    contentOwner: 'string',
                    accessLevel: ['Restricted', 'Confidential', 'Public']
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to get form data',
                error: error.message
            });
        }
    },

    getRoomDetails: async (req, res) => {
        try {
            const { roomId } = req.params;
            const { accessToken } = req;

            const dsApiClient = new docusignRooms.ApiClient();
            dsApiClient.setBasePath(DOCUSIGN_BASE_PATH);
            dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);

            const roomsApi = new docusignRooms.RoomsApi(dsApiClient);
            const room = await roomsApi.getRoom(DOCUSIGN_ACCOUNT_ID, roomId);

            res.status(200).json({
                success: true,
                room: room
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to get room details',
                error: error.message
            });
        }
    },

    updateCreatorAccess: async (req, res) => {
        try {
            const { roomId, creatorId, newRole } = req.params;
            const { accessToken } = req;

            const dsApiClient = new docusignRooms.ApiClient();
            dsApiClient.setBasePath(DOCUSIGN_BASE_PATH);
            dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);

            const roomsApi = new docusignRooms.RoomsApi(dsApiClient);
            
            // Update user's role in the room
            await roomsApi.updateRoomUser(DOCUSIGN_ACCOUNT_ID, roomId, creatorId, {
                roleId: newRole
            });

            res.status(200).json({
                success: true,
                message: 'Creator access updated successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update creator access',
                error: error.message
            });
        }
    }
};



function makeRoomsWithData(args) {
    return {
      body: {
        name: args.projectName, 
        roleId: args.roleId,
        transactionSideId: args.transactionSideId, 
        fieldData: {
          data: {
            projectType: args.projectType,
            contentDescription: args.contentDescription,
            contentOwner: args.contentOwner,
            accessLevel: args.accessLevel,
            // Add other relevant IP content metadata
          }
        }
      }
    };
  }
  
  async function setupIPContentRoom(args) {
    // Initialize DocuSign client
    const dsApiClient = new docusignRooms.ApiClient();
    dsApiClient.setBasePath(args.basePath);
    dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
  
    const roomsApi = new docusignRooms.RoomsApi(dsApiClient);
    const rolesApi = new docusignRooms.RolesApi(dsApiClient);
  
    // Create different roles for different types of creators
    const roles = {
      contentOwner: 'owner-role-id',
      contributor: 'contributor-role-id',
      viewer: 'viewer-role-id'
    };
  
    // Create the room
    const roomWithData = makeRoomsWithData({
      projectName: 'IP Content Project',
      roleId: roles.contentOwner,
      contentDescription: 'Shared IP Content Repository',
      contentOwner: 'Primary Content Owner',
      accessLevel: 'Restricted'
    });
  
    // Create room and get room ID
    const room = await roomsApi.createRoom(args.accountId, roomWithData, null);
  
    // Add documents requiring signatures
    const documents = {
      nda: 'path-to-nda',
      ipAgreement: 'path-to-ip-agreement'
    };
  
    // Add form templates for signatures
    // Add users with appropriate roles
    // Set up document visibility based on signature status
  
    return room;
}
  

async function addCreatorToRoom(roomId, creatorInfo) {
    // Add creator as room user with initial restricted access
    const initialRole = roles.viewer;
    
    // Create signature request for agreements
    const signatureRequest = {
      documents: [
        { type: 'NDA', required: true },
        { type: 'IP_AGREEMENT', required: true }
      ],
      recipient: creatorInfo,
      onComplete: async () => {
        // Update creator's role upon signature completion
        await updateCreatorRole(roomId, creatorInfo.id, roles.contributor);
      }
    };
    
    return await processSignatureRequest(signatureRequest);
}
  

module.exports = router;