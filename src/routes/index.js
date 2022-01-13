const siteRouter = require('./site');
const postRouter = require('./post');

function route(app) {
    app.use('/', siteRouter);
    app.use('/post', postRouter);
}

module.exports = route;
