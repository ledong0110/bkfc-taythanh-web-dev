const path = require('path');

const express = require('express');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars');
const { auth } = require('express-openid-connect');
const app = express();
const port = process.env.PORT || 3000;

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
    baseURL: process.env.PORT
        ? 'https://bkfc-taythanh.herokuapp.com'
        : 'http://localhost:3000',
    clientID: 'yfaaZnedjIAkRN3Pnj8yccdsw6dLDUuq',
    issuerBaseURL: 'https://dev-4kc217q2.us.auth0.com',
    secret: '-5YfLejfmuK2TuaaOdElTUn5z6GmKrWrjRBcM5BqP51wKTTWtQBBgmRHtkus1axK',
    routes: {
        login: false,
        postLogoutRedirect: '/logout_setting',
    },
    authorizationParams: {
        connection: 'google-oauth2',
    },
};

app.use(auth(config));

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
        helpers: {
            // sum: (a, b) => a + b,
            equal: (a, b) => a == b,
            json: (ob) => JSON.stringify(ob),
            or: (a, b) => a || b,
        },
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
// Home, search, contact

//Routes init

app.listen(port, () =>
    console.log(`App Listening at http://localhost:${port}`),
);

route(app);
