const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

// Connect to Mongoose
mongoose.connect('mongodb://localhost/unideia-dev', {
   useNewUrlParser: true 
})  //promise
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

// Formulário para inserir ideias
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});



const port = 5000;
app.listen(port, ()=>{
  console.log(`Server started on port ${port}`);
});