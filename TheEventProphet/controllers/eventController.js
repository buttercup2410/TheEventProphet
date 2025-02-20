const moment = require('moment');
const { render } = require('ejs');
const model = require('../models/event');
const rsvp_model = require('../models/rsvp');

exports.allEvents = (req, res, next) => {
    model.find()
    .then(events => res.render('./event/events', { events }))
    .catch(err => next(err));
};

exports.newEvent = (req, res) => {
    res.render('./event/newEvent');
};

exports.create = (req, res, next) => {
    let event = new model(req.body);
    // event.host = req.session.user ? req.session.user.id : null;
    event.host = req.session.user.id;
    if (req.file) {
        event.image = req.file.filename;
    }
    event.save()
    .then(event => {
        req.flash('success', 'Event created successfully!');
        res.redirect('/event'); 
    })
    .catch(err => {
        console.log(err); 
        if (err.name === 'ValidationError') {
            req.flash('error', 'Failed to create the event. Please check the input fields and try again.');
            err.status = 400;
        }
        next(err);
    });
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    var user_id = null;
    if ('user' in req.session)
        user_id = req.session.user.id;
    Promise.all([model.findById(id).populate('host', 'firstName lastName'), rsvp_model.findOne({event: id, user: user_id}), rsvp_model.countDocuments({ event: id, status: 'YES' })])
    .then(results => {
        const [event, rsvp, count] = results;
        console.log(event)
        if (event) {
            rsvp_status = rsvp ? rsvp.status : null;
            rsvp_count = count;
            const startDisplayDate = moment(event.start).format('dddd, DD MMM YYYY [at] hh:mm A');
            const endDisplayDate = moment(event.end).format('dddd, DD MMM YYYY [at] hh:mm A');
            res.render('./event/event', { event, startDisplayDate, endDisplayDate, rsvp_status, rsvp_count  });
        } else {
            let err = new Error('Cannot find event with id: ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

exports.edit = (req, res, next) => {
    let id = req.params.id;

    model.findById(id)
    .then(event => {
        const offset = event.start.getTimezoneOffset() * 60000;
        event.startdatetimeFormatted = new Date(event.start.getTime() - offset).toISOString().slice(0, 16);
        event.enddatetimeFormatted = new Date(event.end.getTime() - offset).toISOString().slice(0, 16);
        res.render('./event/edit', { event });
    })
    .catch(err => next(err));
};

exports.update = (req, res, next) => {
    let id = req.params.id;
    let event = req.body;
    if (req.file) {
        event.image = req.file.filename;
    }
    event = {...event, start: moment(event.start).toISOString(), end: moment(event.end).toISOString()};
    
    model.findByIdAndUpdate(id, event, { useFindAndModify: false, runValidators: true })
    .then(event => {
        if (event) {
            req.flash('success', 'Event updated successfully!');
            res.redirect('/event/' + id + '/show');
        } else {
            req.flash('error', 'Event not found!');
            res.redirect('/event');
        }
    })
    .catch(err => {
        if (err.name === 'ValidationError') {
            req.flash('error', 'Failed to update the event. Please check the input fields and try again.');
            err.status = 400;
        }
        req.flash('error', 'An error occurred while updating the event.');
        next(err);
    });
};

exports.delete = (req, res, next) => {
    let id = req.params.id;
    Promise.all([model.findByIdAndDelete(id, { useFindAndModify: false }), rsvp_model.deleteMany({event: id})])
    .then(results => {
        const [event, rsvp] = results;
        if (event) {
            req.flash('success', 'Event deleted successfully!');
        } else {
            req.flash('error', 'Event not found!');
        }
        res.redirect('/event');
    })
    .catch(err => {
        req.flash('error', 'An error occurred while deleting the event.');
        next(err);
    });
};

exports.handleRSVP = (req, res, next) => {
    rsvp_model.findOneAndUpdate(
        {event: req.params.id, user: req.session.user.id},
        {
            event: req.params.id,
            user: req.session.user.id,
            status: req.query.status
        },
        {upsert: true, new: true, runValidators: true}
    ).then(rsvp => {
        req.flash('success', "RSVP is updated succesfully!"); 
        res.redirect('/users/profile');
    })
    .catch(err => {
        req.flash('error', "An error occurred while updating the RSVP."); 
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
};
