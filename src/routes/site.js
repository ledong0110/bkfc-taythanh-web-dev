const express = require('express');
const route = require('.');
const router = express.Router();
const { isAuthenticated } = require('../app/middlewares');
const siteController = require('../app/controllers/SiteController');

// newsController.index();
router.get('/', isAuthenticated, siteController.home);
router.get('/profile', isAuthenticated, siteController.profile);
router.patch(
    '/profile/update-avatar',
    isAuthenticated,
    siteController.update_profile,
);
router.get('/contact', isAuthenticated, siteController.contact);
router.get('/login', siteController.login);
router.get('/login_setting', siteController.login_setting);
router.get('/logout_setting', siteController.logout_setting);
router.get('*', isAuthenticated, siteController.not_found);

module.exports = router;
