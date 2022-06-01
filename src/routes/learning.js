const express = require('express');
const route = require('.');
const router = express.Router();
const {
    isKnowLedgeProvider,
    isModerator,
    isAuthenticated,
} = require('../app/middlewares');
const learningController = require('../app/controllers/LearningController');

// newsController.index();
router.get('/', isAuthenticated, learningController.course_list);
router.delete(
    '/',
    isKnowLedgeProvider,
    learningController.course_playlist_delete,
);
router.post(
    '/get_list_courses',
    isKnowLedgeProvider,
    learningController.course_list_return,
);
router.put(
    '/save_list_courses',
    isKnowLedgeProvider,
    learningController.list_save_courses,
);
router.post(
    '/courses/playlist',
    isKnowLedgeProvider,
    learningController.course_playlist,
);
router.get(
    '/courses/create',
    isKnowLedgeProvider,
    learningController.course_create,
);
router.get(
    '/courses/:id/edit',
    isKnowLedgeProvider,
    learningController.course_edit,
);
router.put(
    '/courses/:id',
    isKnowLedgeProvider,
    learningController.course_update,
);
router.delete(
    '/courses/:id',
    isKnowLedgeProvider,
    learningController.course_delete,
);
router.delete(
    '/courses/:id/deleteLesson',
    isKnowLedgeProvider,
    learningController.course_delete_lesson,
);
router.get(
    '/courses/manage',
    isKnowLedgeProvider,
    learningController.course_manage,
);
router.post(
    '/courses/store',
    isKnowLedgeProvider,
    learningController.course_store,
);
router.post(
    '/courses/load-more-courses',
    isKnowLedgeProvider,
    learningController.course_loading,
);
router.get('/courses/:slug', isAuthenticated, learningController.course_access);
router.post(
    '/courses/:slug/addLesson',
    isKnowLedgeProvider,
    learningController.course_add_lesson,
);
router.get(
    '/courses/:slug/lesson',
    isAuthenticated,
    learningController.course_lesson,
);

module.exports = router;
