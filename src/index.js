require('dotenv').config();
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const express = require('express');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars');
const { auth } = require('express-openid-connect');

const app = express();
const port = process.env.PORT;

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const route = require('./routes');
const db = require('./config/db');
// Connect to DB
db.connect();
//Static file
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(__dirname + "/public"));

//Connect auth0
const config = {
    authRequired: false,
    auth0Logout: true,
    baseURL: process.env.baseURL,
    clientID: process.env.clientID,
    issuerBaseURL: process.env.issuerBaseURL,
    secret: process.env.secret,
    routes: {
        login: false,
        postLogoutRedirect: '/logout_setting',
    },
    authorizationParams: {
        connection: 'google-oauth2',
    },
};

app.use(auth(config));

//connect flash
app.use(
    session({
        secret: 'flashmessagetaythanhfc',
        saveUninitialized: true,
        resave: true,
    }),
);
app.use(flash());
//body parser for POST method
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

app.use(methodOverride('_method'));

//HTTP logger, check people accessed
// app.use(morgan('combined'));

// Template handlebars
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'main',
        layoutsDir: './src/resources/views/layouts',
        helpers: require('./utility/helpers'),
    }),
);
// engine.registerHelper('equal', function(lvalue, rvalue, options) {
//     if (arguments.length < 3)
//         throw new Error("Handlebars Helper equal needs 2 parameters");
//     if( lvalue!=rvalue ) {
//         return options.inverse(this);
//     } else {
//         return options.fn(this);
//     }
// });

// app.use((req,res,next) => {
//     console.log("New request:");
//     console.log(req.url);
//     console.log(req.originalMethod);
//     next();
// })

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));
console.log(__dirname);
//Initiate global variables
app.locals.authenticated = 0; // Using in hbs 'authenticated', using in controllers 'req.app.locals.authenticated (type: boolean);
app.locals.user = null; // Using in hbs 'authenticated', using in controllers 'req.app.locals.authenticated (type: object)
app.locals.admin = 0; // Using in hbs 'authenticated', using in controllers 'req.app.locals.authenticated (type: int)
//Socket io config
var count = 0;
var users = [];
io.on('connection', function (socket) {
    console.log('a user connected');
    ++count;
    io.emit('usercnt', count);
    socket.on('add user', (id) => {
        if (!users.includes({ ids: socket.id, id }))
            users.push({ ids: socket.id, id });
        io.emit(
            'onlineUsers',
            users.map((user) => user.id),
        );
    });
    socket.on('disconnect', function () {
        count--;
        users = users.filter((user) => user.ids != socket.id);
        io.emit('usercnt', count);
        io.emit(
            'onlineUsers',
            users.map((user) => user.id),
        );
        console.log('a user disconnected');
    });
});

//Routes init
route(app);

server.listen(port, () =>
    console.log(`App Listening at http://localhost:${port}`),
);
