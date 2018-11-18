const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//Load User Model
require('../models/User');
const User = mongoose.model('users');


// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
})

// User Register Route
router.get('/register', (req, res) => {
  res.render('users/register');
})

// Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});


//Register Form POST -validating the password rules
router.post('/register', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({
      text: 'As senhas inseridas não são iguais. '
    });
  }

  if (req.body.password.length < 6) {
    errors.push({
      text: 'A senha deve conter pelo menos 6 caracteres.'
    });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({ //Verificando se o email ja esta em uso
        email: req.body.email
      })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'O email digitado já foi cadastrado.');
          res.redirect('/users/register');
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });
          //Hash para a senha
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'Seu cadastro foi concluído com sucesso e você já pode fazer login.');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });

        }
      })
  }
});

module.exports = router;