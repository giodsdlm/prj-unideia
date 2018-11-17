const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// User Login Rout
router.get('/login', (req, res) =>{
  res.render('users/login');
})

// User Register Rout
router.get('/register', (req, res) =>{
  res.render('users/register');
})


//Register Form POST
router.post('/register', (req, res) => {
  let errors = [];

  if(req.body.password != req.body.password2){
    errors.push({text: 'As senhas inseridas não são iguais. '});
  }

  if(req.body.password.length < 6){
    errors.push({text:'A senha deve conter pelo menos 6 caracteres.'});
  }

  if(errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2      
    });
  } else {
    res.send('passed');
  }
});

module.exports = router;
