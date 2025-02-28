const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path'); 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const workspaceRoutes = require('./routes/workspaceRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const isAuthenticated = require('./authMiddleware');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
const dbURI = 'mongodb+srv://paulamora200525:Morita200525@cluster0.zqaulnw.mongodb.net/test?retryWrites=true&w=majority';

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

app.use('/api', workspaceRoutes);
app.use('/', bookingRouter);
app.use('/user', userRoutes);

// // Signup Route (POST)
// app.post('/user/signup', async (req, res) => {
//     try {
//         const { email, password, fullname, phone, userType } = req.body;

//         // Check if the user already exists
//         const existingUser = await UserModel.findOne({ email });
//         if (existingUser) {
//             return res.status(400).send('Email is already taken.');
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user
//         const newUser = new UserModel({
//             email, fullname, phone, password: hashedPassword, userType
//         });

//         await newUser.save();
//         res.status(201).json({ message: 'User created successfully', userType });

//     } catch (error) {
//         console.error('Error during signup:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// // Login Route (POST)
// app.post('user/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await UserModel.findOne({ email });
//         if (!user) {
//             return res.status(400).send('User not found');
//         }

//         // Compare password
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(400).send('Invalid email or password.');
//         }

//         // Set session data
//         req.session.userId = user._id; // Store user ID in session

//         res.json({
//             userType: user.userType,
//             fullname: user.fullname,
//             email: user.email
//         });

//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// // Logout Route (to clear session)
// app.post('/logout', (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             return res.status(500).send('Error during logout');
//         }
//         res.json({ message: 'Logged out successfully' });
//     });
// });

// app.post('/co-worker', async (req, res) => {
//     const { Name } = req.body;

//     try {
//         const user = await UserModel.find({ fullname: Name });
            
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         const coworkerSpaces = await Workspace.find({ email: user.email });
            
//         res.status(200).json({
//             fullname: user.fullname,
//             email: user.email,
//             phone: user.phone,
//             rentals: coworkerSpaces,
//         });
//     } catch (error) {
//         console.error('Error fetching coworker data:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

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