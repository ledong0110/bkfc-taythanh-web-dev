const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);

mongoose.plugin(slug);

const CourseList = new Schema(
    {
        _id: { type: Number },
        list_name: { type: String, required: true },
        courses: [{ type: Number, ref: 'Course' }],
    },
    {
        _id: false,
        timestamps: true,
    },
);

//Add plugins
CourseList.plugin(AutoIncrement, { id: 'id_course_list' });

module.exports = mongoose.model('CourseList', CourseList);
