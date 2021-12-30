const express = require('express');
const route = require('.');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

// newsController.index();
router.get('/', siteController.home);

module.exports = router;
