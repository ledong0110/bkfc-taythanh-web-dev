const express = require('express');
const route = require('.');
const router = express.Router();
const { isContentCreator, isModerator } = require('../app/middlewares')
const dashboardController = require('../app/controllers/DashboardController');

// newsController.index();
router.get('/users', isModerator, dashboardController.user_management);
router.patch('/users/:id', isModerator, dashboardController.user_edit);

module.exports = router;
