const Post = require('../models/Post');
const Post_special_list = require('../models/Post-special-list');
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
                    // Post_special_list
                    //     .find()
                    //     .then(result_2 => {
                    //         let ele;
                    //         for (ele in result_2){
                    //             console.log("List found: ", ele);
                    //             ele.posts_checked[result._id] = "0";
                    //             ele.posts_all.push(this._id);
                    //             ele.save();
                    //         }
                    //         res.send("Done");
                    //     })
                    //     .catch(err => {
                    //         console.log("error find special list:");
                    //         console.log(err);
                    //         res.send("Failed")
                    //     })
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
    
}

module.exports = new PostController();
