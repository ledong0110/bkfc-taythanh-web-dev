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
   
    manage_post(req,res,next){
        console.log("in post manage");
        Post_special_list
            .find()
            .populate("posts_all")
            .sort({name: -1})
            .then(result => {
                // console.log("result", result);
                Post
                .count({})
                .then(result_2 => {
                    var top_list;
                    var pop_list;
                    var ele;
                    console.log("Post length now:", result[0].posts_all.length);
                    console.log("Post count now:", result_2)
                    if (result_2 != result[0].posts_all.length){
                        Post
                            .find()
                            .select("_id")
                            .sort({createdAt: -1})
                            .then(allID_raw => {
                                var allID = [];
                                let idEle;
                                console.log(allID_raw);
                                for (let i = 0; i < allID_raw.length; i++){
                                    allID.push(allID_raw[i]._id);
                                }

                                console.log(allID);
                                // top_list.posts_all = allID;
                                // pop_list.posts_all = allID;   
                                // console.log(allID);
                                
                                for (ele in result){
                                    result[ele].posts_all = allID;
                                    for (idEle in allID){
                                        if (result_2 > result[ele].posts_all.length){
                                            if(result[ele][idEle] == undefined){
                                                result[ele].posts_checked[idEle] = "0";
                                            }
                                        }
                                        if (result_2 < result[ele].posts_all.length){
                                            let tempObj = result[ele].posts_checked;
                                            for (let member in result[ele].posts_checked) delete result[ele].posts_checked[member];
                                            if (tempObj[idEle] == "1"){
                                                result[ele].posts_checked[idEle] = "1";
                                            }
                                            else{
                                                result[ele].posts_checked[idEle] = "0";
                                            }
                                        }
                                    }     
                                    switch(result[ele].name){
                                        case "top":
                                            top_list = mongooseToObject(result[ele]);
                                            break;
        
                                        case "popular":
                                            pop_list = mongooseToObject(result[ele]);
                                            // break;
                                    }
                                    Post_special_list
                                        .findOneAndUpdate({name: result[ele].name}, result[ele])
                                        .then(saveListResult => {
                                            console.log("Saved list");
                                        })
                                        .catch(err => {
                                            console.log("Save list failed");
                                            console.log(err);
                                        })
                                }
                                res.redirect("/post/manage");
                                // res.render("dashboard/post-manage", {topList: top_list, popList: pop_list});   
                            })
                    }
                    else{
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
                    }
                    })
                    .catch(err => {
                        console.log("Error count:");
                        console.log(err);
                    });
            })
            .catch(err=>{
                console.log("error:");
                console.log(err);
                res.render("dashboard/post-manage", {specialList: {}});    
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
