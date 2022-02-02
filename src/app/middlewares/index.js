const User = require('../models/User');
const { mongooseToObject } = require('../../utility/mongoose.js');
const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
};
function isAuthenticated(req, res, next) {
    req.app.locals.authenticated = req.oidc.isAuthenticated();
    if (req.oidc.isAuthenticated()) {
        return User.findOne({ email: req.oidc.user.email })
            .then((user) => {
                user = mongooseToObject(user);
                req.app.locals.user = user;
                req.app.locals.user.gg_img = req.oidc.user.picture;
                req.app.locals.user.createdAt =
                    user.createdAt.toLocaleDateString('vi-Vi', options);
                // console.log(req.app.locals.user);
            })
            .then(() => next())
            .catch(() => res.redirect('/logout'));
    } else return next();
}

function isContentCreator(req, res, next) {
    req.app.locals.authenticated = req.oidc.isAuthenticated();
    if (req.oidc.isAuthenticated()) {
        User.findOne({ email: req.oidc.user.email })
            .then((user) => {
                user = mongooseToObject(user);
                req.app.locals.user = user;
                req.app.locals.user.gg_img = req.oidc.user.picture;
                req.app.locals.user.createdAt =
                    user.createdAt.toLocaleDateString('vi-Vi', options);
            })

            .then(() => {
                if (
                    req.app.locals.user.admin == 1 ||
                    req.app.locals.user.admin == 3
                ) {
                    return next();
                } else {
                    res.status(403);
                    res.send('You are not permitted to access this page !');
                }
            })
            .catch(() => {
                res.redirect('/logout');
            });
    } else res.send("You haven't logged in yet !");
}

function isKnownLedgeProvider(req, res, next) {
    req.app.locals.authenticated = req.oidc.isAuthenticated();
    if (req.oidc.isAuthenticated()) {
        User.findOne({ email: req.oidc.user.email })
            .then((user) => {
                user = mongooseToObject(user);
                req.app.locals.user = user;
                req.app.locals.user.gg_img = req.oidc.user.picture;
                req.app.locals.user.createdAt =
                    user.createdAt.toLocaleDateString('vi-Vi', options);
            })

            .then(() => {
                if (
                    req.app.locals.user.admin == 2 ||
                    req.app.locals.user.admin == 3
                ) {
                    return next();
                } else {
                    res.status(403);
                    res.send('You are not permitted to access this page !');
                }
            })
            .catch(() => res.redirect('/logout'));
    } else res.send("You haven't logged in yet !");
}

function isModerator(req, res, next) {
    req.app.locals.authenticated = req.oidc.isAuthenticated();
    if (req.oidc.isAuthenticated()) {
        User.findOne({ email: req.oidc.user.email })
            .then((user) => {
                user = mongooseToObject(user);
                req.app.locals.user = user;
                req.app.locals.user.gg_img = req.oidc.user.picture;
                req.app.locals.user.createdAt =
                    user.createdAt.toLocaleDateString('vi-Vi', options);
            })

            .then(() => {
                if (req.app.locals.user.admin == 3) {
                    return next();
                } else {
                    res.status(403);
                    res.send('You are not permitted to access this page !');
                }
            })
            .catch(() => {
                res.redirect('/logout');
            });
    } else res.send("You haven't logged in yet !");
}

module.exports = {
    isAuthenticated,
    isContentCreator,
    isKnownLedgeProvider,
    isModerator,
};
