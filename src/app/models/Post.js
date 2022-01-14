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
        slug: { type: String, slug: 'title', unique: true },
        idV: { type: String},
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
