const Post = require('../models/Post');
const multer = require('multer');
const { multipleMongooseToObject, mongooseToObject } = require('../../utility/mongoose');

class PostController {
    //[GET] /
    all_post(req,res,next){
        console.log("All post");
        Post.find().sort({createdAt: -1})
            .then((result) => {
                console.log("All blog:", result);
                res.render("posts/post-all", {all_post: multipleMongooseToObject(result)});    
            })
            .catch(err=>{
                res.render("posts/post-all", {all_post: null});    
            })
    }

    create(req, res, next){
        console.log("In get create")
        res.render("posts/post-create");
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

    show(req, res, next)
    {
        Post.findOne({ slug: req.params.slug })
            .then((post) => {
                res.render('posts/show', {
                    post: mongooseToObject(post),
                });
            })
            .catch(next);
    }
    
}

module.exports = new PostController();
