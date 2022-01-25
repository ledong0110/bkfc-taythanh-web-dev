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
            image_url: req.body.image_url,
            author: req.app.locals.user._id
        });

        if (newPost){
            console.log(newPost);
            // newBlog.body = newBlog.body.replace(/\r\n/g, "\n");
        }
        newPost.save()
            .then((result) => {
                    console.log("Success uploading");
                    res.send("Done");
            })
            .catch((err)=>{
                console.log("Failed to upload post:", err);
                res.send("Failed")
            });
        
        // console.log(Object.values(req.body.title));
        // console.log(Object.values(req.body.content));
    }
   
    
    //[GET] /post/show
    show(req, res, next)
    {
        Post.findOne({ slug: req.params.slug }).populate('author', 'name')
            .then((post) => {
                if (post)
                {
                    post = mongooseToObject(post);
                    
                    post.createdAt = post.createdAt.toLocaleDateString('vi-Vi', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    res.render('posts/show', {
                        post: post,
                    });
                }
                else
                    res.send('Sorry, We can\'t find your page');
            })
            .catch(next);
    }


    post_edit(req, res, next){
        console.log("in edit page");
        const postSlug = req.params.slug;
        Post
            .findOne({slug: postSlug})
            .then(foundPost => {
                console.log("Found post");
                var returnPost = mongooseToObject(foundPost);
                returnPost["content_json"] = returnPost.content;
                res.render("posts/post-edit", {post: returnPost});
            })
            .catch(err=>{
                console.log("Can not find post:");
                console.log(err);
                res.send("Some error occured, please try again");
            })
    }


    post_edit_save(req, res, next){
        console.log("updating post...");
        req.body.content = JSON.parse(req.body.content);

        let newQuery = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            image_url: req.body.image_url,
            author: req.app.locals.user._id
        };

        if (newQuery){
            console.log(newQuery);
            // newBlog.body = newBlog.body.replace(/\r\n/g, "\n");
        }

        Post.findOneAndUpdate({slug: req.body.slug}, newQuery)
            .then((result) => {
                    console.log("Success updating post");
                    console.log(result);
                    res.send("Done");
            })
            .catch((err)=>{
                console.log("Failed to update post:", err);
                res.send("Failed")
            });
    }
    

    post_delete(req, res, next){
        console.log("In delete post");
        var postSlug = req.body.slug;
        console.log(req.body);
        console.log("Deleting post...")

        Post
            .findOne({slug: postSlug})
            .then(result => {
                result.delete()
                    .then(result_2 =>{
                        console.log("Deleted post");
                        res.append('Signal', 1);
                        res.send("Done");
                    })
                    .catch(err => {
                        console.log(err);
                        res.append('Signal', 0);
                        res.send("Failed");
                    })
            })
            .catch(err => {
                console.log(err);
                res.append('Signal', 0);
                res.send("Failed");
            })
    }
}

module.exports = new PostController();
