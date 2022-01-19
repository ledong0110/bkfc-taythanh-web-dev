const Post = require('../models/Post');
const User = require('../models/User');
const multer = require('multer');
const { multipleMongooseToObject, mongooseToObject } = require('../../utility/mongoose');

class DashboardController {
    //[GET] /
    user_management(req,res,next){
        res.send("Users page")
    }

    
}

module.exports = new DashboardController();
