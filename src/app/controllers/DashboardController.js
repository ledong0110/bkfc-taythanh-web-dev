const Post = require('../models/Post');
const Post_special_list = require('../models/Post-special-list');
const User = require('../models/User');

const { convertRole } = require('../../utility/convertRole');
const { multipleMongooseToObject, mongooseToObject } = require('../../utility/mongoose');

class DashboardController {
    //[GET] /
    user_management(req,res,next){
        User.find({}).sort({ default_user: -1, admin: -1 , updatedAt: 1})
            .then((users) =>{
                users = multipleMongooseToObject(users);
                users.forEach((user) => {
                    user.admin = convertRole(user.admin)
                    user.createdAt = user.createdAt.toLocaleDateString('vi-Vi', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                });
                
                return users
            })
            .then((users) => {
                res.render('dashboard/user_manage', {
                    users        
                })  
            })
                // console.log(multipleMongooseToObject(users));
            
            .catch(next);
    }

    user_edit(req,res,next) {
        User.updateOne({ _id: req.params.id }, req.body)
                    .then(() => res.redirect('back'))
                    .catch(next);
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
        
}

module.exports = new DashboardController();
