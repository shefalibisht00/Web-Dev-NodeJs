var express = require('express');
var app = express();
var path = require('path');
const flash = require('connect-flash');
var cookieParser = require('cookie-parser');

// Authentication
var passport   = require('passport')
var session    = require('express-session')


var passportConfig = require('./config/passport');

//  This extracts the entire body part of an incoming request and exposes it in a 
// format that is easier to work with. In this case, we will use the JSON format.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// For Passport
 
app.use(
  session({ 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized:false
  })
); // session secret
 
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Connect flash
app.use(flash());

//Handle post requests using body parser
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var models = require("./models");
// Global variables


// Import all routes
app.use('/',  require('./routes/index'));

// 404 Page response 
app.use( (req, res, next) => {
	const error = new Error('Page not Found!');
	error.status = 	404;
	res.render("error");
})

app.listen('8080', function () {
    console.log("Running on 8080")
  });