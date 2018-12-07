const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {
  ensureAuthenticated
} = require('../helpers/auth');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// User Idea Index Page
router.get('/myideas', ensureAuthenticated, (req, res) => {
  Idea.find({user: req.user.id})
    .sort({
      date: 'desc'
    })
    .then(ideas => {
      res.render('ideas/myideas', {
        ideas: ideas
      });
    });
});

// General Idea Index Page
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({})
    .sort({
      date: 'desc'
    })
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

// Add ideas form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});


// Edit ideas form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  
  Idea.findOne({
      _id: req.params.id,
    })
    .then(idea => {
      if (idea.user != req.user.id) {
        req.flash('error_msg', 'Acesso não autorizado.');
        res.redirect('/ideas');
      } else {
        res.render('ideas/edit', {
          idea: idea
        });
      }
    })
});


// Process form
router.post('/', ensureAuthenticated, (req, res) => {

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
    res.render('/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id, 
      autor: req.user.name,
      email: req.user.email
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Nova ideia adicionada!');
        res.redirect('/ideas');
      })
  }
});

// Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      //new values
      idea.title = req.body.title;
      idea.details = req.body.details;

      idea.save()
        .then(idea => {
          req.flash('success_msg', 'Alteração registrada com sucesso.');
          res.redirect('/ideas');
        })
    });
});


// Delete Process
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.deleteOne({
      _id: req.params.id
    })
    .then(() => {
      req.flash('success_msg', 'Ideia removida!');
      res.redirect('/ideas');
    });
});

module.exports = router;