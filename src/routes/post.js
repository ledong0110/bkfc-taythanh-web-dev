const express = require('express');
const route = require('.');
const router = express.Router();
const { isContentCreator } = require('../app/middlewares')
const postController = require('../app/controllers/PostController');

// newsController.index();
router.get('/create', isContentCreator,postController.create);
router.post('/create', postController.create_post);
router.get('/all', postController.all_post);

router.get('/:slug', postController.show);

module.exports = router;
