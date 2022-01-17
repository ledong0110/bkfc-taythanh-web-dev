const express = require('express');
const route = require('.');
const router = express.Router();

const postController = require('../app/controllers/PostController');

// newsController.index();
router.get('/create', postController.create);
router.post('/create', postController.create_post);
router.get('/all', postController.all_post);

module.exports = router;
