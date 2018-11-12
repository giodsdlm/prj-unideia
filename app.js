const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Connect to Mongoose
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

// Formulário para inserir ideias
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// Processar formulário
app.post('/ideas', (req, res) => {

//Validação de campos vazios no lado do servidor.
  let errors = [];

   if (!req.body.title) {
     errors.push({text: 'Por favor adicione um título.'});
   }
   if (!req.body.details) {
     errors.push({text: 'Por favor adicione detalhes.'});
   }

   if(errors.length > 0){ 
     res.render('ideas/add', {
       errors: errors,
       title: req.body.title,
       details: req.body.details
     });
   } else {
     res.send('passed');
   }
});


const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});