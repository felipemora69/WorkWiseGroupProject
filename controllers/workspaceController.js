const Workspace = require('../models/workspaceModel');
const multer = require('multer');
const path = require('path');
const { google } = require('googleapis');
const oauth2Client = require('../routes/workspaceRoutes').oauth2Client;


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to upload files to Google Drive
async function uploadToGoogleDrive(fileBuffer, fileName) {
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const fileMetadata = {
        name: fileName, // We can use the original file name or any custom name
        parents: ['appDataFolder'],  // Specify folder ID in Google Drive if required
    };
    const media = {
        mimeType: fileBuffer.mimetype,  // Dynamically use the MIME type
        body: fileBuffer,  // Use the file buffer
    };

    try {
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink',  // Fetch the ID and webViewLink (URL) after upload
        });

        console.log('File uploaded to Google Drive with ID:', response.data.id);
        return response.data.webViewLink;  // Return the URL of the uploaded file
    } catch (error) {
        console.error('Error uploading file to Google Drive:', error);
        throw new Error('Failed to upload file to Google Drive');
    }
}

async function createWorkspace(req, res) {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        // Example of uploading an image to Google Drive after authentication
        const drive = google.drive({ version: 'v3', auth: oauth2Client });
        const fileMetadata = {
            name: 'sample.jpg',
            parents: ['appDataFolder'],  // You can specify the folder if you want
        };
        const media = {
            mimeType: 'image/jpeg',
            body: req.files[0].buffer,  // File buffer for Google Drive upload
        };
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });
        console.log('File uploaded to Google Drive with ID:', response.data.id);

        const imageUrls = req.files.map(file => '/images/' + file.filename);
        const createdBy = req.session.userId;

        const workspaceData = {
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
            location: req.body.location,
            address: req.body.address,
            area: req.body.area,
            capacity: req.body.capacity,
            smoking: req.body.smoking,
            parking: req.body.parking,
            distanceToTransport: req.body.distanceToTransport,
            images: imageUrls,
            createdBy: createdBy
        };

        const workspace = new Workspace(workspaceData);

        const savedWorkspace = await workspace.save();
        console.log('Workspace created:', savedWorkspace);

        res.status(201).json({ message: 'Workspace created successfully' });
    } catch (error) {
        console.error('Error creating workspace:', error);
        res.status(500).json({ error: 'Error creating workspace' });
    }

};

const getAllWorkspaces = async (req, res) => {
    try {
        console.log('Fetching workspaces...');
        const workspaces = await Workspace.find();
        console.log('Workspaces:', workspaces);
        res.json(workspaces);
    } catch (err) {
        console.error('Error fetching workspaces:', err.message);
        res.status(500).json({ message: err.message });
    }
};

// Function to get workspaces created by the logged-in user
const getMyWorkspaces = async (req, res) => {
    try {
        console.log('Fetching workspaces of current user...');
        const userId = req.session.userId; 
        const workspaces = await Workspace.find({ createdBy: userId });
        console.log('User Workspaces:', workspaces);
        res.json(workspaces);
    } catch (err) {
        console.error('Error fetching user workspaces:', err.message);
        res.status(500).json({ message: err.message });
    }
};

async function deleteWorkspace(req, res) {
    try {
        const workspaceId = req.params.id;
        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({ error: 'Workspace not found' });
        }

        await Workspace.findByIdAndDelete(workspaceId);
        
        res.status(200).json({ message: 'Workspace deleted successfully' });
    } catch (error) {
        console.error('Error deleting workspace:', error);
        res.status(500).json({ error: 'Error deleting workspace' });
    }
}

const updateWorkspace = async (req, res) => {
    try {
        const workspaceId = req.params.id;
        const updatedData = req.body; 
        const updatedWorkspace = await Workspace.findByIdAndUpdate(workspaceId, updatedData, { new: true });
        res.json(updatedWorkspace);
    } catch (error) {
        console.error('Error updating workspace:', error);
        res.status(500).json({ error: 'Error updating workspace' });
    }
};


module.exports = {
    createWorkspace,
    getAllWorkspaces, 
    getMyWorkspaces,
    deleteWorkspace, 
    updateWorkspace
};