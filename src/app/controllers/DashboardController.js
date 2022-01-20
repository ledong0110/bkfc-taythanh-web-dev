const Post = require('../models/Post');
const User = require('../models/User');
const { convertRole } = require('../../utility/convertRole');
const { multipleMongooseToObject } = require('../../utility/mongoose');

class DashboardController {
    //[GET] /
    user_management(req,res,next){
        User.find({}).sort({ admin: -1 })
            .then((users) =>{
                users = multipleMongooseToObject(users);
                users.forEach((user) => user.admin = convertRole(user.admin));
                
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

    
    
}

module.exports = new DashboardController();
