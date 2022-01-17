const Post = require('../models/Post');
const { multipleMongooseToObject, ...rest } = require('../../utility/mongoose');

class SiteController {
    //[GET] /
    home(req, res, next) {
        Post.find().sort({createdAt: -1}).limit(3)
            .then((result) => {
                console.log("All blog:", result);
                res.render("home", {breaking_post: multipleMongooseToObject(result)});    
            })
            .catch(err=>{
                res.render("home", {breaking_post: []});    
            })
    }
}

module.exports = new SiteController();
