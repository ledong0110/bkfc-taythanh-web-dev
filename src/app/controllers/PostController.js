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
   
    manage_post(req,res,next){
        console.log("in post manage");
        Post_special_list
            .find()
            .sort({name: -1})
            .populate("posts_all")
            .then(result => {
                console.log("result", result);
                var top_list;
                var pop_list;
                var ele;
                for (ele in result){
                    switch(result[ele].name){
                        case "top":
                            top_list = mongooseToObject(result[ele]);
                            break;

                        case "popular":
                            pop_list = mongooseToObject(result[ele]);
                            // break;
                    }
                }
                res.render("dashboard/post-manage", {topList: top_list, popList: pop_list});    
            })
            .catch(err=>{
                console.log("error:");
                console.log(err);
                // res.render("dashboard/post-manage", {specialList: {}});    
            })
    }

    manage_top_post(req, res, next){
        console.log("Updating top post...")
        console.log(req.body);

        let updateOptions = { upsert: true };
        let newPost_all = [];
        let newPost_top = {};
        var ele;
        for (ele in req.body){
            newPost_top[ele] = req.body[ele];
            newPost_all.push(Number(ele));
        }

        console.log(newPost_all);

        let topList = {
            posts_all: newPost_all,
            posts_checked: newPost_top
        }

        Post_special_list
            .findOneAndUpdate({name: "top"}, topList, updateOptions)
            .then(result => {
                console.log("List updated");
                res.append('Signal', 1);
                res.send("done");

            })
            .catch(err => {
                console.log("Failed to update top list");
                console.log(err);
                res.append('Signal', 0);
                res.send("Failed")
            })

        
    }

    manage_popular_post(req, res, next){
        
        console.log("Updating pop post...")
        console.log(req.body);

        let updateOptions = { upsert: true };
        let newPost_all = [];
        let newPost_pop = {};
        var ele;
        for (ele in req.body){
            newPost_pop[ele] = req.body[ele];
            newPost_all.push(Number(ele));
        }

        console.log(newPost_all);

        let popList = {
            posts_all: newPost_all,
            posts_checked: newPost_pop
        }

        Post_special_list
            .findOneAndUpdate({name: "popular"}, popList, updateOptions)
            .then(result => {
                console.log("List updated");
                res.append('Signal', 1);
                res.send("done");

            })
            .catch(err => {
                console.log("Failed to update popular list");
                console.log(err);
                res.append('Signal', 0);
                res.send("Failed")
            })
    }
    
    //[GET] /post/show
    show(req, res, next)
    {
        Post.findOne({ slug: req.params.slug })
            .then((post) => {
                if (post)
                    res.render('posts/show', {
                        post: mongooseToObject(post),
                    });
                else
                    res.send('Sorry, We can\'t find your page');
            })
            .catch(next);
    }
    
}

module.exports = new PostController();
