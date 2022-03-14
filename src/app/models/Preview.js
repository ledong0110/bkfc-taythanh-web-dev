const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const Preview = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true},
        content: { type: Object, required: true},
        image_url: { type: String },
    },
    {
        timestamps: true,
    },
);



module.exports = mongoose.model('preview', Preview);