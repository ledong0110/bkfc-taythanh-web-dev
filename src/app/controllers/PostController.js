const Post = require('../models/Post');
const bodyParser = require('body-parser')
const multer = require('multer');
const { multipleMongooseToObject, ...rest } = require('../../utility/mongoose');

class PostController {
    //[GET] /
    create(req, res, next){
        res.render("post-create");
    };

    create_post(req, res, next){
        console.log(req.body);
        res.redirect("/");
    }
}

module.exports = new PostController();
