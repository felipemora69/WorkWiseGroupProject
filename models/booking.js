const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    startDate: Date,
    endDate: Date,
    startTime: String,
    endTime: String,
    workspaceTitle: String,
    userName: String
});

bookingSchema.statics.checkOverlap = async function(startDate, endDate, startTime, endTime, workspaceTitle) {
    try {
        const overlap = await this.exists({
            workspaceTitle,
            $or: [
                {
                    startDate: { $lt: new Date(endDate), $gt: new Date(startDate) },
                    $or: [
                        { startTime: { $lt: endTime } },
                        { endTime: { $gt: startTime } }
                    ]
                },
                {
                    startDate: { $lte: new Date(startDate) },
                    endDate: { $gte: new Date(endDate) }
                }
            ]
        });
        return overlap;
    } catch (error) {
        console.error('Error checking overlaps:', error);
        throw new Error('Failed to check overlapping bookings');
    }
};


const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;