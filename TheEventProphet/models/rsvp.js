    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    const rsvpSchema = new Schema({
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event', 
            required: [true, "Event Id is required!"]},
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: [true, "User Id is required!"]},
        status: { type: String, required: [true, 'Status is required!'],
            enum: [
                'YES', 
                'NO', 
                'MAYBE',
            ]}
    });

    module.exports = mongoose.model('rsvp', rsvpSchema);