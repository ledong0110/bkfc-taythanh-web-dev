const Post = require('../models/Post');
const Post_special_list = require('../models/Post-special-list');
const User = require('../models/User');
const Video = require('../models/Video');

const { convertRole } = require('../../utility/support');
const { multipleMongooseToObject, mongooseToObject } = require('../../utility/mongoose');
const { info } = require('node-sass');

class DashboardController {
    //[GET] /
    user_management(req,res,next){
        const limit = 10;
        Promise.all([
            User.countDocuments(),
            User.find()
            .select({ updatedAt: 0})
            .sort({ default_user: -1, admin: -1 , updatedAt: 1})
            .limit(limit)
        ])
        .then(([totalPages, users]) => {
            users = multipleMongooseToObject(users);
            users.forEach((user) => {
                user.admin = convertRole(user.admin)
                user.createdAt = user.createdAt.toLocaleDateString('vi-Vi', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            });
            res.render('dashboard/user_manage', {
                totalPages: Math.ceil(totalPages/limit),
                message: req.flash('message')[0],
                users, 
            })       
        })
        // console.log(multipleMongooseToObject(users));
        
        .catch(next);
    }
    
    //[POST] /dashboard/users/load-more-users
    user_loading (req, res, next) {
        const limit = 10;
        User.find()
            .select({ updatedAt: 0})
            .sort({ default_user: -1, admin: -1 , updatedAt: 1})
            .skip(req.body.page*limit)
            .limit(limit)
            .then((users) => {
                users = multipleMongooseToObject(users);
                users.forEach((user) => {
                    user.admin = convertRole(user.admin)
                    user.createdAt = user.createdAt.toLocaleDateString('vi-Vi', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                });
                res.json(users);
            })
        
    }
    user_edit(req,res,next) {
        User.updateOne({ _id: req.params.id }, req.body)
        .then(() => {
                        req.flash(
                            'message', {
                                type: 'success',
                                message: 'Cập nhật thành công'
                            }
                        )
                        res.redirect('back')
                    })
                    .catch((err) => {
                        req.flash(
                            'message', {
                                type: 'danger',
                                message: 'Có lỗi gì rồi, hỏi mấy cha dev thử'
                            }
                        )
                        res.redirect('back')
                    });
    }

    manage_post(req,res,next){
        console.log("in post manage");
        Promise.all([
            Post_special_list
                .find().sort({name: -1})
                .populate({
                    path: "posts_all",
                    populate: { path: 'author', select: 'name' },
                    options:{
                        sort:{createdAt: -1}
                    },
                }),
            Post.countDocumentsDeleted()
        ])
            .then(([result, deletedPost]) => {
                // console.log("result", result[0].posts_all);
                Post
                .count({})
                .then(result_2 => {
                    var top_list;
                    var hot_list;
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
        
                                        case "hot":
                                            hot_list = mongooseToObject(result[ele]);
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

                                case "hot":
                                    hot_list = mongooseToObject(result[ele]);
                                    // break;
                            }
                        }
                        res.render("dashboard/post-manage", {topList: top_list, hotList: hot_list, deletedPost});
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
        let newPost_top_load = []
        var ele;
        
        for (ele in req.body){
            if (req.body[ele] == "1"){
                newPost_top[ele] = req.body[ele];
                newPost_top_load.push(Number(ele));
            }
            newPost_all.push(Number(ele));
        }

        console.log(newPost_all);

        let topList = {
            posts_all: newPost_all,
            posts_checked: newPost_top,
            posts_checked_load: newPost_top_load
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

    manage_hot_post(req, res, next){
        console.log("Updating hot post...")
        console.log(req.body);

        let updateOptions = { upsert: true };
        let newPost_all = [];
        let newPost_pop = {};
        let newPost_pop_load = [];
        var ele;
        for (ele in req.body){
            if (req.body[ele] == "1"){
                newPost_pop[ele] = req.body[ele];
                newPost_pop_load.push(Number(ele));
            }
            newPost_all.push(Number(ele));
        }

        console.log(newPost_all);

        let popList = {
            posts_all: newPost_all,
            posts_checked: newPost_pop,
            posts_checked_load: newPost_pop_load
        }

        Post_special_list
            .findOneAndUpdate({name: "hot"}, popList, updateOptions)
            .then(result => {
                console.log("List updated");
                res.append('Signal', 1);
                res.send("done");

            })
            .catch(err => {
                console.log("Failed to update hot list");
                console.log(err);
                res.append('Signal', 0);
                res.send("Failed")
            })
    }
    //[GET] /dashboard/trash-bin
    trash_bin(req, res, next){
        Post.findDeleted()
                    .then((posts) =>
                    res.render('dashboard/trash-bin',{
                        deletedPosts: multipleMongooseToObject(posts)
                    })
                    )
                    .catch(next);
        
    }
    
    //[GET] /dashboard/general
    general_info (req, res, next) {
        Promise.all([User.countDocuments(), Post.countDocuments(), User.countDocuments({'admin': 0})  ])
        .then(([participants, posts, members]) => {
            res.render('dashboard/general-info', {
                participants: participants,
                posts,
                members: participants - members,
            })
        })
    }
    //[POST] /dashboard/submit_video
    submit_video (req, res, next) {
        Video.updateOne({code: 1}, req.body, {upsert: 1})
             .then (() => {
                res.send('1');
             })
    }
        
}

module.exports = new DashboardController();
