const Event = require('../models/event');
const User = require('../models/user');

//check if user is guest
exports.isGuest = (req, res, next)=>{
    if(!req.session.user){
        return next();
    }
    else {
        req.flash('error', 'You are already logged in!');
        return res.redirect('/users/profile');
    }
};

//check if user is authenticated
exports.isLoggedIn = (req, res, next)=>{
    if(req.session.user){
        return next();
    }
    else {
        req.flash('error', 'You need to log in first!');
        return res.redirect('/users/login');
    }
};

//check if user is host
exports.isHost = (req, res, next)=>{
    let id = req.params.id;
    
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        return next(err);
    }   

    Event.findById(id)
    .then(event=>{
        if(event){
            if(event.host = req.session.user.id){
                return next();
            }
            else {
                let err = new Error('Unauthorized to access the resource!');
                err.status = 401;
                return next(err);
            }
        }
        else
        {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

//check if user is not a host
exports.isNotHost = (req, res, next)=>{
    let id = req.params.id;
    
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        return next(err);
    }   

    Event.findById(id)
    .then(event=>{
        if(event){
            if(event.host != req.session.user.id){
                return next();
            }
            else {
                let err = new Error('Unauthorized to access the resource!');
                err.status = 401;
                return next(err);
            }
        }
        else
        {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};