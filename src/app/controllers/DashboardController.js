const Post = require('../models/Post');
const User = require('../models/User');
const multer = require('multer');
const { multipleMongooseToObject, mongooseToObject } = require('../../utility/mongoose');

class DashboardController {
    //[GET] /
    user_management(req,res,next){
        User.find({})
            .then((users) =>{
                res.render('dashboard/user_manage', {
                    users: multipleMongooseToObject(users),
                }
                );
                // console.log(multipleMongooseToObject(users));
            }
            )
            .catch(next);
    }

    
    
}

module.exports = new DashboardController();
