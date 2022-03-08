const Course = require('../models/Course');
const CourseList = require('../models/CourseList');

const { convertRole } = require('../../utility/support');
const {
    multipleMongooseToObject,
    mongooseToObject,
} = require('../../utility/mongoose');
const { info } = require('node-sass');

class LearningController {
    //[GET] /learning/
    course_list(req, res, next) {
        CourseList.find({})
            .select({ courses: 1, list_name: 1 })
            .populate({
                path: 'courses',
                options: {
                    sort: { createdAt: -1 },
                },
                select: {
                    lessons: 0,
                    idV: 0,
                    __v: 0,
                    updatedAt: 0,
                    createdAt: 0,
                    deleted: 0,
                },
            })
            .then((list_courses) => {
                list_courses = multipleMongooseToObject(list_courses);
                res.render('learning/home', {
                    list_courses,
                });
            })
            .catch(next);
    }

    //[GET] /learning/courses/create
    course_create(req, res, next) {
        res.render('learning/create');
    }

    //[POST] /learning/courses/store
    course_store(req, res, next) {
        req.body.image = `https://img.youtube.com/vi/${req.body.idV}/sddefault.jpg`;
        const course = new Course({
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            idV: req.body.idV,
            level: req.body.level,
        });
        course
            .save()
            .then((saved_course) => {
                CourseList.updateOne(
                    { _id: req.body.list_id },
                    { $push: { courses: saved_course._id } },
                ).then(() => {
                    res.send('Done');
                });
            })
            .catch((error) => {
                console.log(error);
                res.send('Someting error');
            });
    }

    //[GET] /learning/courses/:id/edit
    course_edit(req, res, next) {
        Course.findById(req.params.id)
            .then((course) =>
                res.render('learning/edit', {
                    course: mongooseToObject(course),
                }),
            )
            .catch(next);
    }
    //[PUT] /learning/courses/:id
    course_update(req, res, next) {
        req.body.image = `https://img.youtube.com/vi/${req.body.idV}/sddefault.jpg`;
        Course.updateOne({ _id: req.params.id }, req.body)
            .then(() => {
                res.redirect('/learning/courses/manage');
            })
            .catch((err) => console.log('err'));
    }
    //[DELETE] /learning/courses/:id
    course_delete(req, res, next) {
        Course.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    //[DELETE] /learning/courses/:id/deleteLesson
    course_delete_lesson(req, res, next) {
        console.log(req.body.lessonId);
        var arrIndex = `lessons.${req.body.lessonId}`;
        Course.updateOne({ _id: req.params.id }, { $unset: { [arrIndex]: 1 } })
            .then(() => {
                Course.updateOne(
                    { _id: req.params.id },
                    { $pull: { lessons: null } },
                ).then(() => {
                    res.send('done');
                });
            })
            .catch(next);
    }
    //[GET] /learning/courses/manage
    course_manage(req, res, next) {
        Course.find({})
            .then((courses) =>
                res.render('learning/course-manage', {
                    courses: multipleMongooseToObject(courses),
                }),
            )
            .catch(next);
    }
    //[GET] /learning/courses/:slug
    course_access(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then((course) => {
                res.render('learning/show', {
                    course: mongooseToObject(course),
                });
            })
            .catch(next);
    }

    //[POST] /learning/courses/:slug/addLesson
    course_add_lesson(req, res, next) {
        console.log(req.params.slug);
        Course.updateOne(
            { slug: req.params.slug },
            {
                $push: {
                    lessons: {
                        name: req.body.nameLesson,
                        link: req.body.linkLesson,
                    },
                },
            },
        ).then(() => {
            res.redirect('back');
        });
    }

    //[GET] /learning/courses/:slug/lesson?id={LESSON_INDEX}
    course_lesson(req, res, next) {
        Course.findOne({ slug: req.params.slug }).then((course) => {
            res.render('learning/lesson', {
                content: mongooseToObject(course.lessons[req.query.id]),
            });
        });
    }

    //[POST] /learning/courses/playlist
    course_playlist(req, res, next) {
        const courseList = new CourseList({
            list_name: req.body.list_name,
        });
        courseList.save().then(() => res.redirect('/learning'));
    }

    course_playlist_delete(req, res, next) {
        CourseList.deleteOne({ _id: req.body.deleteList }).then(() => {
            res.send('done');
        });
    }
}

module.exports = new LearningController();
