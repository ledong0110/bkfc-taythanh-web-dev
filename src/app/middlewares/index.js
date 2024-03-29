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
    req.session.returnTo = req.originalUrl;
    if (req.flash('auth').length > 0) req.app.locals.auth = true;
    else req.app.locals.auth = false;

    if (req.flash('access').length > 0) {
        req.app.locals.access = true;
    } else req.app.locals.access = false;

    if (req.oidc.isAuthenticated()) {
        return User.findOne({ email: req.oidc.user.email })
            .then((user) => {
                user = mongooseToObject(user);
                req.app.locals.user = user;
                req.app.locals.user.gg_img = req.oidc.user.picture;
                req.app.locals.user.createdAt =
                    user.createdAt.toLocaleDateString('vi-Vi', options);
            })
            .then(() => next())
            .catch(() => res.redirect('/logout'));
    } else return next();
}

function isContentCreator(req, res, next) {
    req.app.locals.authenticated = req.oidc.isAuthenticated();
    req.app.locals.auth = false;

    if (req.flash('access').length > 0) req.app.locals.access = true;
    else req.app.locals.access = false;

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
                    req.flash('access', '1');
                    res.redirect('back');
                }
            })
            .catch(() => {
                res.redirect('/logout');
            });
    } else {
        req.flash('auth', '1');
        res.redirect('back');
    }
}

function isKnowLedgeProvider(req, res, next) {
    req.app.locals.authenticated = req.oidc.isAuthenticated();
    req.app.locals.auth = false;

    if (req.flash('access').length > 0) req.app.locals.access = true;
    else req.app.locals.access = false;

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
                    req.flash('access', '1');
                    res.redirect('back');
                }
            })
            .catch(() => res.redirect('/logout'));
    } else {
        req.flash('auth', '1');
        res.redirect('back');
    }
}

function isModerator(req, res, next) {
    req.app.locals.authenticated = req.oidc.isAuthenticated();
    req.app.locals.auth = false;
    req.app.locals.access = false;
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
                    req.flash('access', '1');
                    res.redirect('back');
                    // res.send('You are not permitted to access this page !');
                }
            })
            .catch(() => {
                res.redirect('/logout');
            });
    } else {
        req.flash('auth', '1');
        res.redirect('back');
    }
}

module.exports = {
    isAuthenticated,
    isContentCreator,
    isKnowLedgeProvider,
    isModerator,
};
