const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);

mongoose.plugin(slug);

const Post = new Schema(
    {
        _id: { type: Number },
        title: { type: String, required: true },
        description: { type: String, required: true},
        content: { type: Object, required: true},
        image_url: { type: String },
        // top:{type: Boolean, default: false},
        // popular:{type: Boolean, default: false},
        slug: { type: String, slug: 'title', unique: true },
        author: { type: Number, ref: 'User'},
        views: {type: Number, default: 0},
    },
    {
        _id: false,
        timestamps: true,
    },
);

//Add plugins
Post.plugin(AutoIncrement);

Post.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Post', Post);
