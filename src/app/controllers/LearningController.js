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
        Promise.all([
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
                }),
            Course.find({}).sort({ updatedAt: -1 }).select({
                lessons: 0,
                idV: 0,
                __v: 0,
                createdAt: 0,
            }),
        ])
            .then(([list_courses, all_courses]) => {
                list_courses = multipleMongooseToObject(list_courses);
                res.render('learning/home', {
                    list_courses,
                    all_courses: multipleMongooseToObject(all_courses),
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
        const course = new Course({
            name: req.body.course_name,
            description: req.body.course_description,
            image: req.body.course_image,
            level: req.body.course_level,
            initial_user: req.app.locals.user._id
        });
        course
            .save()
            .then((saved_course) => {
                if (req.body.state == 1)
                {
                    CourseList.updateOne(
                        { _id: req.body.list_id },
                        { $push: { courses: saved_course._id } },
                    )
                    .catch(() => {
                        res.send("Bị lỗi gì rồi đó anh bạn à !")
                    })
                }
                
            })
            .then(() => res.redirect('back'))
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
        Course.updateOne({ _id: req.params.id }, {
            name: req.body.course_name,
            description: req.body.course_description,
            image: req.body.course_image,
            level: req.body.course_level,
        })
            .then(() => {
                res.redirect('/learning/courses/manage');
            })
            .catch((err) => console.log('lỗi rổi bạn tôi ơi!'));
    }
    //[DELETE] /learning/courses/:id
    course_delete(req, res, next) {
        Course.deleteOne({ _id: req.params.id })
            .then(() => res.send('done'))
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
        const limit = 10;
        Promise.all([Course.find({}).populate('initial_user', 'name').limit(limit), Course.countDocuments()])
            .then(([courses, counts]) => {
                courses = multipleMongooseToObject(courses);
                courses.forEach((course) => {
                    course.createdAt = course.createdAt.toLocaleDateString(
                        'vi-Vi',
                        {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        },
                    );
                });
                return [courses, counts]
                }      
            )
            .then(([courses, counts]) => 
                res.render('learning/course-manage', {
                    courses: courses,
                    counts: Math.ceil(counts/ limit)
                    }
                )
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

    //[DELETE] /learning/
    course_playlist_delete(req, res, next) {
        CourseList.deleteOne({ _id: req.body.deleteList }).then(() => {
            res.send('done');
        });
    }

    //[POST] /learning/get_list_courses
    course_list_return(req, res, next) {
        CourseList.findOne({ _id: req.body.id_list })
            .select({ courses: 1 })
            .then((course_id) => {
                res.json(mongooseToObject(course_id).courses);
            });
    }

    //[PUT] /learning/save_list_courses
    list_save_courses(req, res, next) {
        var saved = [];
        if (req.body.courses_saved_in_list)
            saved = req.body.courses_saved_in_list.map(Number);
        CourseList.updateOne(
            { _id: req.body.list_id },
            { courses: saved },
        ).then(() => {
            res.send('done');
        });
    }

    //[POST] /courses/load more
    course_loading(req, res, next) {
        const limit = 10;
        Course.find()
            .select({ updatedAt: 0 })
            .sort({ default_user: -1, admin: -1, updatedAt: 1 })
            .skip(req.body.page * limit)
            .limit(limit)
            .populate('initial_user', 'name')
            .then((courses) => {
                courses = multipleMongooseToObject(courses);
                courses.forEach((course) => {
                    course.createdAt = course.createdAt.toLocaleDateString(
                        'vi-Vi',
                        {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        },
                    );
                });
                res.json(courses);
            });
    }
}

module.exports = new LearningController();
