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
        description: { type: String },
        content: { type: String },
        image: { type: String },
        slug: { type: String, slug: 'name', unique: true },
        idV: { type: String, required: true },
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
