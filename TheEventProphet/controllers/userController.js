const model = require('../models/user');
const Event = require('../models/event');
const rsvp_model = require('../models/rsvp');

exports.signup = (req, res)=>{
    // return res.redirect('./user/signup');
    res.render('./user/signup');
};

exports.create = (req, res, next)=>{
    let user = new model(req.body);
    user.save()
    .then(user=> {
        req.flash('success', 'You have successfully signed up! You can now login.');
        res.redirect('/users/login')
    })
    .catch(err=>{
    if(err.name === 'ValidationError' ) {
        req.flash('error', err.message);  
        return res.redirect('/users/signup');
    }
    if(err.code === 11000) {
        req.flash('error', 'This email has already been used!');      
        return res.redirect('/users/signup');
    }
        next(err);
    }); 
};

exports.getUserLogin = (req, res, next)=>{
    return res.render('./user/login');
};

exports.login = (req, res, next)=>{
    let email = req.body.email;
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            console.log('wrong email address');
            req.flash('error', 'wrong email address');  
            res.redirect('/users/login');
        } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = {id: user._id, firstName: user.firstName, lastName: user.lastName};
                    req.flash('success', 'You have successfully logged in!');
                    res.redirect('/');
                } else {
                    req.flash('error', 'wrong password');      
                    res.redirect('/users/login');
                }
            });     
        }     
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user.id;
    Promise.all([model.findById(id), Event.find({host: id}), rsvp_model.find({user: id}).populate('event')])
    .then(results=> {
        const [user, events, rsvp_events] = results;
        res.render('user/profile', { user, events , rsvp_events });
    })
    .catch(err => {
        console.error('Error in profile route:', err); 
        next(err); 
    });
};

exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err){
            return next(err)
        }
        else{   
            res.redirect('/');
            // req.flash('success', 'You have successfully logged out!');
        }
    });
};