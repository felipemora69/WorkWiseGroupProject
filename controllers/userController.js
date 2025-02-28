const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');

// Signup User
const signup = async (req, res) => {
    try {
        const { fullname, email, phone, password, userType } = req.body;

        // Check if the email already exists in the database
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists. Please choose a different email.' });
        }

        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user model
        const newUser = new UserModel({
            fullname,
            email,
            phone,
            password: hashedPassword,
            userType
        });

        // Save the new user to MongoDB
        await newUser.save();

        req.session.userId = newUser._id;


        // Redirect user based on userType using absolute path
        const token = jwt.sign({ id: newUser._id }, config.secret, { expiresIn: '1h' });
        res.status(200).json({ token, userType: newUser.userType });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Login User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Compare the hashed password from the database with the input pasword
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        req.session.userId = user._id;


        const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: '1h' });
        res.status(200).json({ token, userType: user.userType });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.session.userId;
        
        // Fetch user data based on user ID
        const user = await UserModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send user profile data in response
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

};

module.exports = { login, signup, getUserProfile };