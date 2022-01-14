const Post = require('../models/Post');
const multer = require('multer');
const { multipleMongooseToObject, ...rest } = require('../../utility/mongoose');

class PostController {
    //[GET] /
    create(req, res, next){
        console.log("In get create")
        res.render("post-create");
    };

    create_post(req, res, next){
        console.log("Post submited");
        req.body.content = JSON.parse(req.body.content);
        console.log(req.body);
        
        let newPost = new Post({
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            image_url: req.body.image_url
        });

        if (newPost){
            console.log(newPost);
            // newBlog.body = newBlog.body.replace(/\r\n/g, "\n");
        }
        newPost.save()
            .then((result) => {
                    console.log("Success uploading");
                    res.redirect("/");
            })
            .catch((err)=>{
                console.log("Failed to upload post:", err);
            });
        res.redirect("/");
        // console.log(Object.values(req.body.title));
        // console.log(Object.values(req.body.content));
    }
    
}

module.exports = new PostController();
