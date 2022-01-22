const express = require('express');
const route = require('.');
const router = express.Router();
const { isContentCreator, isModerator } = require('../app/middlewares')
const dashboardController = require('../app/controllers/DashboardController');
const postController = require('../app/controllers/PostController');

// newsController.index();
router.get('/users', isModerator, dashboardController.user_management);
router.patch('/users/:id', isModerator, dashboardController.user_edit);
router.get('/post-manage', isContentCreator, dashboardController.manage_post);
router.post('/post-manage/top-post', dashboardController.manage_top_post);
router.post('/post-manage/popular-post', dashboardController.manage_popular_post);


module.exports = router;
