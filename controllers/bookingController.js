const jwt = require('jsonwebtoken');
const Booking = require('../models/booking');

// create a new booking and check for overlap
const createBooking = async (req, res) => {
    try {
        const { startDate, endDate, startTime, endTime, workspaceTitle} = req.body;

        const token = req.headers.authorization.split(' ')[1]; 
        const decodedToken = jwt.verify(token, 'your_secret_key'); // Verify and decode JWT token
        const userName = decodedToken.username;


        console.log('Checking for overlap...');
        // Check for overlap
        const overlap = await Booking.checkOverlap(startDate, endDate, startTime, endTime, workspaceTitle);
        console.log('Overlap:', overlap);

        if (overlap) {
            return res.status(400).json({ message: 'Booking overlaps with existing booking' });
        }

        // Create a new booking 
        const booking = new Booking({
            workspaceTitle,
            startDate,
            endDate,
            startTime,
            endTime, 
            userName: req.user.username
        });

        // Save the booking
        await booking.save();

        res.status(201).json({ message: 'Booking created successfully' });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
};

        const getBookedWorkspacesByUsername = async (req, res) => {
            try {
                const { username } = req.params;
        
                // Fetch booked workspaces for the user from the database
                const bookings = await Booking.find({ userName: username });
        
                res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching booked workspaces:', error);
        res.status(500).json({ error: 'Failed to fetch booked workspaces' });
    }
};

module.exports = { createBooking, getBookedWorkspacesByUsername };