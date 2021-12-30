const Post = require('../models/Post');
const { multipleMongooseToObject, ...rest } = require('../../utility/mongoose');

class SiteController {
    //[GET] /
    home(req, res, next) {
        res.render('home');
    }
}

module.exports = new SiteController();
