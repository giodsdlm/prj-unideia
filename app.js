const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to Mongoose and defining project database
mongoose.connect('mongodb://localhost/unideia-dev', {
    useNewUrlParser: true
  }) //promise
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// Body Parser Middleware
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json());


// Static folder
app.use(express.static(path.join(__dirname, 'public')));


// Method override Middleware
app.use(methodOverride('_method'));


// Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect Flash
app.use(flash());

//Global Variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


// Index Route
app.get('/', (req, res) => {
  const title = 'Bem vindo'
  res.render('index', {
    title: title
  });
});


// About
app.get('/about', (req, res) => {
  res.render('about');
});


// Use routes
app.use('/ideas', ideas);
app.use('/users', users);


const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});