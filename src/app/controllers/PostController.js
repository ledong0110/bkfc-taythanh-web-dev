const Post = require('../models/Post');
const multer = require('multer');
const { multipleMongooseToObject, ...rest } = require('../../utility/mongoose');

class PostController {
    //[GET] /
    create(req, res, next){
        res.render("post-create");
    };

    create_post(req, res, next){
        console.log("Post submited");
        req.body.content = JSON.parse(req.body.content);
        console.log(req.body);
        console.log(req.body.content.blocks);
        // console.log(Object.values(req.body.title));
        // console.log(Object.values(req.body.content));
        res.redirect("/");
    }
}

module.exports = new PostController();
