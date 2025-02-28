const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');
const multer = require('multer');
const path = require('path');
const isAuthenticated = require('../authMiddleware');
const { google } = require('googleapis');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Google OAuth2 setup
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,  // Your Google Client ID
    process.env.GOOGLE_CLIENT_SECRET,  // Your Google Client Secret
    'http://localhost:8000/oauth2callback'  // Redirect URI
);

// Generate authentication URL
router.get('/auth/google', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/drive.file']
    });
    res.redirect(authUrl);
});

// OAuth2 callback route
router.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        // You can now access Google Drive
        res.send('Google Drive authentication successful!');
    } catch (error) {
        console.error('Error during OAuth callback:', error);
        res.status(500).send('Error during authentication');
    }
});

router.post('/workspaces', isAuthenticated, upload.array('images', 5), workspaceController.createWorkspace);
router.get('/workspaces', workspaceController.getAllWorkspaces);
router.get('/myworkspaces', workspaceController.getMyWorkspaces); 
router.delete('/workspaces/:id', isAuthenticated, workspaceController.deleteWorkspace);
router.put('/workspaces/:id', workspaceController.updateWorkspace);

module.exports = router;