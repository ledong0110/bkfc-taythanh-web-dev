const Post = require('../models/Post');
const Post_special_list = require('../models/Post-special-list');
const multer = require('multer');
const { multipleMongooseToObject, mongooseToObject } = require('../../utility/mongoose');

class PostController {
    post_home(req, res, next){
        Post_special_list
            .find().sort({name: -1})
            .populate({
                path: "posts_checked_load",
                options:{
                    sort:{createdAt: -1}
                }
            })
            .then(post_list_arr => {
                res.render("posts/post", {breaking_post: multipleMongooseToObject(post_list_arr)});
            })
        // Post.find().sort({createdAt: -1}).limit(3)
        //     .then(result => {
        //         console.log(result);
        //         res.render("posts/post", {breaking_post: multipleMongooseToObject(result)});
        //     })
        //     .catch(err=>{
        //         res.render("posts/post", {breaking_post: []});    
        //     })
    }

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
        Post.findOneAndUpdate({ slug: req.params.slug }, { $inc: { views: 1} }).populate('author', 'name')
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
            .findOneWithDeleted({slug: postSlug})
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
        };

        if (newQuery){
            console.log(newQuery);
            // newBlog.body = newBlog.body.replace(/\r\n/g, "\n");
        }

        Post.findOneAndUpdateWithDeleted({slug: req.body.slug}, newQuery)
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

    //[PATCH] /post/:id/restore
    post_restore(req, res, next)
    {
        Post.restore({ _id: req.params.id })
                    .then(() => res.redirect('back'))
                    .catch(next);
    }

    //[GET] /post/my-post
    my_post(req, res, next)
    {
        Promise.all([Post.find({author: req.app.locals.user._id}).sort({createdAt: -1}), Post.countDocumentsDeleted({author: req.app.locals.user._id})])
        .then(([result, deletedPost]) => {
            // console.log(deletedPost);
            // res.send(result);
            res.render("posts/my-post", {my_post: multipleMongooseToObject(result), deletedPost});
        })
        
    }

    //[GET] /post/my-post-bin
    my_post_bin(req, res, next)
    {
        Post.findDeleted({author: req.app.locals.user._id})
                    .then((posts) =>
                    res.render('posts/my-post-bin',{
                        deletedPosts: multipleMongooseToObject(posts)
                    })
                    )
                    .catch(next);
    }

    //[DELETE] /post/force-delete
    post_force_delete(req, res, next){
        var pid = req.body.id;
        Post.deleteOne({_id: pid})
            .then(() => {
                res.append('Signal', 1);
                res.send("Done");
            })
            .catch(err => {
                console.log(err);
                res.append('Signal', 0);
                res.send("Failed");
            });
        
    }
}

module.exports = new PostController();
