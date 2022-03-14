const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const Video = new Schema(
    {
        code: {type: Number},
        video1: { type: String, required: true },
        video2: { type: String, required: true},
        video3: { type: String, required: true},
    },
    {
        timestamps: true,
    },
);



module.exports = mongoose.model('video', Video);