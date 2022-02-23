const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);

mongoose.plugin(slug);

const Course = new Schema(
    {
        _id: { type: Number },
        name: { type: String, required: true },
        description: { type: String },
        image: { type: String },
        slug: { type: String, slug: 'name', unique: true },
        lessons: { 
            type: [{
                name: {type: String, default: ''},
                link: {type: String, default: ''},
            }],
            default: [],
            required: false,
        } ,
        idV: { type: String, required: true },
        level: { type: String },
    },
    {
        _id: false,
        timestamps: true,
    },
);

//Add plugins
Course.plugin(AutoIncrement, { id: 'id_course' });

Course.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Course', Course);
