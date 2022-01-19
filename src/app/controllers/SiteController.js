const Post = require('../models/Post');
const User = require('../models/User');
const { multipleMongooseToObject, ...rest } = require('../../utility/mongoose');

class SiteController {
    //[GET] /
    home(req, res, next) {
        Post.find().sort({createdAt: -1}).limit(3)
            .then((result) => {
                res.render("home", {breaking_post: multipleMongooseToObject(result)});    
            })
            .catch(err=>{
                res.render("home", {breaking_post: []});    
            })
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
        const role = ['User','Content Creator', 'Knownledge Provider', 'Moderator'];
        let user = req.app.locals.user;
        user.admin = role[user.admin];
        res.render('profile', { user });
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
        let users = {
            name: req.oidc.user.name,
            picture: req.oidc.user.picture,
        };
        User.findOne({ email: req.oidc.user.email })
            .then((user) => {
                if (!user) {
                    const add_user = new User({
                        name: req.oidc.user.name,
                        email: req.oidc.user.email,
                        admin: 0,
                    });
                    add_user.save().then();
                } 
            })
            .then(() => {
                req.app.locals.user = req.oidc.user;
                req.app.locals.authenticated = req.oidc.isAuthenticated();
            })
            .catch(next);
        
        
        res.redirect('/');
    }
    // [GET] /logout_setting
    logout_setting(req, res) {
        req.app.locals.user = null;
        req.app.locals.authenticated = req.oidc.isAuthenticated();
        res.redirect('/');
    }
    // [GET] /*
    not_found(req, res, next) {
        res.status = 404;
        res.send('Sorry we can find your page');
    }
}

module.exports = new SiteController();
