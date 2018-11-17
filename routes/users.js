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


module.exports = router;
