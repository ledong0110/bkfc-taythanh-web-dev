const express = require('express');
const route = require('.');
const router = express.Router();
const { isContentCreator, isAuthenticated } = require('../app/middlewares')
const postController = require('../app/controllers/PostController');

// newsController.index();
router.delete('/', isContentCreator, postController.post_delete);
router.get('/', isAuthenticated, postController.post_home);
router.get('/create', isContentCreator,postController.create);
router.post('/create', isContentCreator, postController.create_post);
router.get('/all', isAuthenticated, postController.all_post);
router.post('/all/loadmore', isAuthenticated, postController.post_loadmore);
router.delete('/force-delete', isContentCreator, postController.post_force_delete);
router.get('/my-post', isContentCreator, postController.my_post);
router.get('/my-post-bin', isContentCreator, postController.my_post_bin);
router.get('/edit/:slug', isContentCreator, postController.post_edit);
router.post('/edit', isContentCreator, postController.post_edit_save);
router.patch('/:id/restore', isContentCreator, postController.post_restore);
router.get('/:slug', isAuthenticated, postController.show);


module.exports = router;