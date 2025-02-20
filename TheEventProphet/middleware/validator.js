const mongoose = require('mongoose');
const moment = require('moment');
const {body, param, query} = require('express-validator');
const passport = require('passport');
const {validationResult} = require('express-validator');

exports.sanitizeInput = [
    body('*').trim().escape(),
    body('email').normalizeEmail(),
];

exports.validateId = (req, res, next) => {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
        return next();
    } else {
        const error = new Error('Invalid id format!');
        error.status = 400;
        return next(error);
    }
};

exports.validateResult = (req, res, next)=>{
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
       errors.array().forEach(error=>{
            req.flash('error', error.msg);  
       });
       return res.redirect('back');
    } else {
        return next();
    }
}

exports.validateSignup =     [
    body('firstName', 'first name cannot be empty').notEmpty().trim().escape(),
    body('lastName', 'last name cannot be empty').notEmpty().trim().escape(),
    body('email').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be atleast 8 characters and at most 64 characters').isLength({min: 8, max: 64}).trim()
];

exports.validateLogin =     [
    body('email').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be atleast 8 characters and at most 64 characters').isLength({min: 8, max: 64}).trim()
];

exports.validateEvent =     [
    body('title','Please enter a valid event title').notEmpty().trim().escape(),
    body('highlight','Please enter a valid event highlight').notEmpty().trim().escape(),
    body('location','Please enter a valid location').notEmpty().trim().escape(),
    body('category','Please enter a valid category').notEmpty().isIn(['Academic Events', 'Study Groups', 'Club Meetings', 'Career Fairs', 'Hackathons', 'Art Exhibitions', 'Other']).escape(),
    body('details','Please enter a valid details').notEmpty().isLength({min: 10}).trim().escape(),
    body('start','Please enter a valid start date').notEmpty().isISO8601().isAfter(new Date().toDateString()),
    body('end','Please enter a valid end date').notEmpty().isISO8601()
    .custom((value, {req})=>{
        if (moment(value).isBefore(req.body.start)) {
            throw new Error('End date must be after start date');
        }
        return true;
    })
];

exports.validateRSVP =     [
    param('id','Please enter a valid event id').notEmpty().trim().escape(),
    query('status','Please enter a valid status').notEmpty().isIn(['YES', 'NO', 'MAYBE']),
];

// module.exports = { sanitizeInput, validateId };