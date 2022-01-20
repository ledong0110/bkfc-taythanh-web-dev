const siteRouter = require('./site');
const postRouter = require('./post');
const dashboardRouter = require('./dashboard');

function route(app) {
    app.use('/post', postRouter);
    app.use('/dashboard', dashboardRouter);
    app.use('/', siteRouter);
    
}

module.exports = route;
