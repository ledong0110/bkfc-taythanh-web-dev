const User = require('../models/User');
const { mongooseToObject } = require('../../utility/mongoose.js')
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
function isAuthenticated(req, res, next)
{
    if (req.oidc.isAuthenticated())
    {
        return User.findOne({ email: req.oidc.user.email })
            .then((user) => {
                user = mongooseToObject(user);
                req.app.locals.authenticated = true;
                req.app.locals.user = req.oidc.user;
                req.app.locals.user.admin = user.admin;
                req.app.locals.user.createdAt = user.createdAt.toLocaleDateString('vi-Vi', options);
                // console.log(req.app.locals.user);
            })
            .then(() => next());
        
    }
    else
        return next();
}

function isContentCreator(req, res, next)
{
    if (req.oidc.isAuthenticated())
    {
        User.findOne({ email: req.oidc.user.email })
            .then((user) => {
                user = mongooseToObject(user);
                req.app.locals.authenticated = true;
                req.app.locals.user = req.oidc.user;
                req.app.locals.user.admin = user.admin;
                req.app.locals.user.createdAt = user.createdAt.toLocaleDateString('vi-Vi', options);
                
            })
        
            .then(() => {
                if (req.app.locals.user.admin == 1 || req.app.locals.user.admin == 3)
                {    
                    return next();
                }
                else
                {
                    res.send('You are not permitted to access this page !');
                }
            });
    }
    else
        res.send('You haven\'t logged in yet !');
}

function isKnownLedgeProvider(req, res, next)
{
    if (req.oidc.isAuthenticated())
    {
        User.findOne({ email: req.oidc.user.email })
            .then((user) => {
                user = mongooseToObject(user);
                req.app.locals.authenticated = true;
                req.app.locals.user = req.oidc.user;
                req.app.locals.user.admin = user.admin;
                req.app.locals.user.createdAt = user.createdAt.toLocaleDateString('vi-Vi', options);
            })

        if (req.app.locals.user.admin == 2 || req.app.locals.user.admin == 3)
        {        
            return next();
        }
        else
        {
            res.send('You are not permitted to access this page !');
        }
    }
    else
        res.send('You haven\'t logged in yet !');
}

function isModerator(req, res, next)
{
    if (req.oidc.isAuthenticated())
    {
        User.findOne({ email: req.oidc.user.email })
            .then((user) => {
                user = mongooseToObject(user);
                req.app.locals.authenticated = true;
                req.app.locals.user = req.oidc.user;
                req.app.locals.user.admin = user.admin;
                req.app.locals.user.createdAt = user.createdAt.toLocaleDateString('vi-Vi', options);
            })
        
        
        if (req.app.locals.user.admin == 3)
        {        
            return next();
        }
        else
        {
            res.send('You are not permitted to access this page !');
        }
    }
    else
        res.send('You haven\'t logged in yet !');
    
}

module.exports = {isAuthenticated, isContentCreator, isKnownLedgeProvider, isModerator};