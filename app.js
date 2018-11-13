const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Connect to Mongoose e defining project database
mongoose.connect('mongodb://localhost/unideia-dev', {
    useNewUrlParser: true
  }) //promise
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));


// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');


// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// Body Parser Middleware
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())


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


// Idea Index Page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({date:'desc'})
    .then(ideas =>{
      res.render('ideas/index', {
        ideas:ideas
      });
    });
});

// Add ideas form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});


// Edit ideas form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea:idea
    });
  })
});


// Process form
app.post('/ideas', (req, res) => {

  //Validating empty fields on the server side
  let errors = [];

  if (!req.body.title) {
    errors.push({
      text: 'Por favor adicione um título.'
    });
  }
  if (!req.body.details) {
    errors.push({
      text: 'Por favor adicione detalhes.'
    });
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        res.redirect('/ideas');
      })
  }
});


const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});