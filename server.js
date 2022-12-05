var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
// session middleware
var session = require('express-session');
var passport = require('passport');
var methodOverride = require('method-override');

// load the env vars
require('dotenv').config();


// create the Express app
var app = express();

// connect to the MongoDB with mongoose
require('./config/database');
// configure Passport
require('./config/passport');

// require our routes
var indexRoutes = require('./routes/index');
var studentsRoutes = require('./routes/students');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// mount the session middleware
// This creates our session cookie, 
// which is a string that is sent to browser when they login to our app, 
// then the browser on every single request the client makes sends the cookie with thier request
// to identify the browser that is sending the request
app.use(session({
  secret: 'SEI Rocks!',
  resave: false,
  saveUninitialized: true
}));
// The session cookie must be created before passport can use it!
// you want to set up passport right after your session

app.use(passport.initialize()); // straight from the docs
app.use(passport.session());


// to make sure req.user is accessible in every view
app.use(function(req, res, next){
  // attached to locals is what the property/variable that will be availible throughout our application 
  // in ejs, in every view.ejs file, we will have a user variable
  res.locals.user = req.user; // if we are not logged in req.user will be undefined
  // creates a "user" variable
  // that is availiable in every single
  // ejs file now


  // the students/index.ejs, line 22 if(user) <- is an example of how to use this
  next();
})

// mount all routes with appropriate base paths
app.use('/', indexRoutes);
app.use('/', studentsRoutes);

// invalid request, send 404 page
app.use(function(req, res) {
  res.status(404).send('Cant find that!');
});

module.exports = app;
