const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const Post_special_list = new Schema(
    {
        name:{
            type: String,
            required:true,
            unique: true
        },
        posts_all:[{
            type: Number,
            ref: 'Post',
            required: true
        }],
        posts_checked:{
            type: Object,
            required: true
        }
    },
    {
        // _id: false,
        timestamps: true,
    },
);

//Add plugins
// top_post.plugin(AutoIncrement);

// top_post.plugin(mongooseDelete, {
//     deletedAt: true,
//     overrideMethods: 'all',
// });

module.exports = mongoose.model('post_special_list', Post_special_list);
