const express = require('express');
const route = require('.');
const router = express.Router();
const { isContentCreator } = require('../app/middlewares')
const postController = require('../app/controllers/PostController');

// newsController.index();
router.delete('/', isContentCreator, postController.post_delete);
router.get('/', postController.post_home);
router.get('/create', isContentCreator,postController.create);
router.post('/create', postController.create_post);
router.get('/all', postController.all_post);
router.get('/edit/:slug', isContentCreator, postController.post_edit);
router.post('/edit', isContentCreator, postController.post_edit_save);
router.patch('/:id/restore', isContentCreator, postController.post_restore);
router.get('/:slug', postController.show);


module.exports = router;