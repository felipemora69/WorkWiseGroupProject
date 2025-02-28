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

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
require('dotenv').config();

const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

async function connect() {
    try {
        await mongoose.connect(dbURI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

connect();

// Session store
const store = new MongoDBStore({
    uri: dbURI,
    collection: 'sessions'
});

// Catch errors
store.on('error', function(error) {
    console.error('Session store error:', error);
});

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { secure: false} 
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

// Serverless function handler for Vercel
app.get('/', (req, res) => {
    res.send('Hello, Vercel!');
});

module.exports = app;

app.use('/api', workspaceRoutes);
app.use('/', bookingRouter);
app.use('/user', userRoutes);

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

//Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});