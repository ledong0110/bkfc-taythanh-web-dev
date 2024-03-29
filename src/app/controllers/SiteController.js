const Post = require('../models/Post');
const User = require('../models/User');
const Post_special_list = require('../models/Post-special-list');
const {
    multipleMongooseToObject,
    mongooseToObject,
} = require('../../utility/mongoose');
const { convertRole, getRandom } = require('../../utility/support');

class SiteController {
    //[GET] /
    home(req, res, next) {
        // res.redirect("/post");
        res.render('site/home');
    }

    // [GET] /profile
    //****************************
    //Role NOTE:
    //Id:   Role:
    // 0:   User
    // 1:   Content Creator
    // 2:   Knowledge Provider
    // 3:   Master, Moderator, Dev
    //****************************

    profile(req, res) {
        var user_profile = Object.assign({}, req.app.locals.user);
        user_profile.admin = convertRole(user_profile.admin);
        res.render('site/profile', { user_profile });
    }

    // [PATCH] /profile/update-avatar
    update_profile(req, res) {
        User.updateOne(
            { _id: req.app.locals.user._id },
            { picture: req.body.image },
        ).then(() => {
            res.send('Done');
        });
    }

    // [GET] /contact
    contact(req, res) {
        res.render('site/contact');
    }

    // [GET] /login
    login(req, res) {
        req.app.locals.users = null;
        req.app.locals.authenticated = req.oidc.isAuthenticated();
        req.app.locals.admin = 0;
        res.oidc.login({ returnTo: '/login_setting' });
    }
    // [GET] /login_setting
    login_setting(req, res, next) {
        User.findOne({ email: req.oidc.user.email }).then((user) => {
            req.app.locals.authenticated = req.oidc.isAuthenticated();
            if (!user) {
                const add_user = new User({
                    name: req.oidc.user.name,
                    email: req.oidc.user.email,
                    picture: req.oidc.user.picture,
                });
                add_user.save().then(() => {
                    req.app.locals.user = {
                        name: req.oidc.user.name,
                        email: req.oidc.user.email,
                        picture: req.oidc.user.picture,
                        admin: 0,
                    };
                    if (typeof req.session.returnTo == 'undefined')
                        res.redirect('/');
                    else res.redirect(req.session.returnTo);
                });
            } else {
                req.app.locals.user = user;
                if (typeof req.session.returnTo == 'undefined')
                    res.redirect('/');
                else res.redirect(req.session.returnTo);
            }
        });
    }
    // [GET] /logout_setting
    logout_setting(req, res) {
        req.app.locals.user = null;
        req.app.locals.authenticated = req.oidc.isAuthenticated();
        res.redirect('/');
    }
    // [GET] /*
    not_found(req, res, next) {
        res.status(404);
        res.render('site/notFound');
    }

    //[GET] /test
    test(req, res) {
        res.render('test');
    }
}

module.exports = new SiteController();
