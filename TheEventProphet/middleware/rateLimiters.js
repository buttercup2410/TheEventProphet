const rateLimit = require('express-rate-limit');

exports.logInLimiter = rateLimit({ 
    windowMs: 10 * 60 * 1000, 
    max: 10, 
    handler: (req, res, next) => {
        let err = new Error('Too many login attempts! Try again in 10 minutes.');
        err.status = 429;
        return next(err);
    }
});