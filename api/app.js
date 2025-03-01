const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path'); 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const workspaceRoutes = require('../routes/workspaceRoutes');
const bookingRouter = require('../routes/bookingRoutes');
const userRoutes = require('../routes/userRoutes');
const isAuthenticated = require('../authMiddleware');
const multer = require('multer');
const fs = require('fs');
const { google } = require('googleapis');
require('dotenv').config();

const cors = require('cors');
// Enable CORS for a specific domain (your frontend URL)
const corsOptions = {
    origin: 'https://work-wise-group-project.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions)); // Apply CORS middleware globally

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Google OAuth2 Client Setup
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// Multer setup for file handling
const upload = multer({ storage: multer.memoryStorage() });

const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Session store
const store = new MongoDBStore({
    uri: dbURI,
    collection: 'sessions'
});

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { secure: process.env.NODE_ENV === 'production' } 
}));

app.get('/login', (req, res) => {
    try{
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
    }catch (error) {
        console.error('Error serving login.html:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/signup', (req, res) => {
    try{
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
    }catch (error) {
        console.error('Error serving signup.html:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/owner', isAuthenticated, (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'owner.html'));
    } catch (error) {
        console.error('Error serving owner.html:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/co-worker', isAuthenticated, (req, res) => {
    try{
        res.sendFile(path.join(__dirname, 'public', 'co-worker.html'));
    } catch (error) {
        console.error('Error serving co-worker.html:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.use('/api', workspaceRoutes);
app.use('/', bookingRouter);
app.use('/user', userRoutes);

// Route to handle workspace creation
app.post('/api/workspaces', async (req, res) => {
    try {
        const { name, category, price, description, location, address, area, capacity, smoking, parking, distanceToTransport, images } = req.body;
        
        const newWorkspace = {
            name, category, price, description, location, address, area, capacity, smoking, parking, distanceToTransport
        };

        // If images are provided, upload them to Google Drive
        const imageUrls = [];
        for (const image of images) {
            const imageUrl = await uploadImageToGoogleDrive(image); // Upload image and get URL
            imageUrls.push(imageUrl);
        }

        newWorkspace.images = imageUrls;  // Save the image URLs in the workspace object

        // Assume that you're saving to MongoDB or some other database here
        // await newWorkspace.save();  // Uncomment this line for actual DB saving

        res.status(200).json(newWorkspace);  // Return the workspace object with image URLs
    } catch (error) {
        console.error('Error creating workspace:', error);
        res.status(500).send('Error creating workspace');
    }
});

// Function to upload an image to Google Drive
async function uploadImageToGoogleDrive(image) {
    try {
        const fileMetadata = {
            name: image.originalname,  // Original file name
            parents: ['YOUR_GOOGLE_DRIVE_FOLDER_ID']  // Optionally specify folder ID in Google Drive
        };
        
        const media = {
            mimeType: image.mimetype,
            body: Buffer.from(image.buffer)
        };

        // Upload the file to Google Drive
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink'  // Return the file ID and URL
        });

        // Return the Google Drive URL
        return response.data.webViewLink;  // Return the URL of the uploaded file
    } catch (error) {
        console.error('Error uploading image to Google Drive:', error);
        return null;  // Return null if upload fails
    }
}

// Route to upload image to Google Drive
app.post('/upload-to-google-drive', upload.single('file'), async (req, res) => {
    try {
        const imageUrl = await uploadImageToGoogleDrive(req.file);  // Pass the image file from memory
        
        if (imageUrl) {
            res.json({ fileUrl: imageUrl });  // Return the URL of the uploaded file
        } else {
            res.status(500).send('Failed to upload image');
        }
    } catch (error) {
        console.error('Error in /upload-to-google-drive:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Google OAuth2 setup for Vercel
app.get('/auth/google', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/drive.file'],
        redirect_uri: process.env.GOOGLE_REDIRECT_URI // Use the redirect URI from environment variable
    });
    res.redirect(authUrl);
});

app.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        res.send('Google Drive authentication successful!');
    } catch (error) {
        console.error('Error during OAuth callback:', error);
        res.status(500).send('Error during authentication');
    }
});

// Serve static files and handle front-end pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve HTML files
app.get('/finda-workspace', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'FindaWorkspace.html'));
    } catch (error) {
        console.error('Error serving FindaWorkspace.html:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to serve Sections.html
app.get('/sections', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'sections.html'));
    } catch (error) {
        console.error('Error serving Sections.html:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to serve Product.html
app.get('/product', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'product.html'));
    } catch (error) {
        console.error('Error serving Product.html:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = app;