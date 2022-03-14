const siteRouter = require('./site');
const postRouter = require('./post');
const dashboardRouter = require('./dashboard');
const learningRouter = require('./learning');

function route(app) {
    app.use('/post', postRouter);
    app.use('/dashboard', dashboardRouter);
    app.use('/learning', learningRouter);
    app.use('/', siteRouter);
    
}

module.exports = route;
