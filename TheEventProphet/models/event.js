const { DateTime } = require("luxon");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: [true, 'Title is required'] },
    host: { type: Schema.Types.ObjectId , ref: 'User'},
    highlight: { type: String, required: [true, 'Highlight is required'] },
    details: { type: String, required: [true, 'Details is required'], minLength: [10, 'The content should have at least 10 characters'] },
    location: { type: String, required: [true, 'Location is required'] },
    category: { type: String, required: [true, 'Category is required'],
    enum: [
        'Academic Events', 
        'Study Groups', 
        'Club Meetings', 
        'Career Fairs', 
        'Hackathons', 
        'Art Exhibitions', 
        'Other'
    ] },
    start: { type: Date, required:true },
    end: { type: Date, required:true },
    image: { type: String, required: [true, 'Image is required'] },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
