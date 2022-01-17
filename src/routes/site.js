const express = require('express');
const route = require('.');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

// newsController.index();
router.get('/', siteController.home);
router.get('/profile', siteController.profile);
router.get('/login', siteController.login);
router.get('/login_setting', siteController.login_setting);
router.get('/logout_setting', siteController.logout_setting);
router.get('*', siteController.not_found);

module.exports = router;
