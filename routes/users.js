const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// User Login Rout
router.get('/login', (req, res) =>{
  res.send('login');
})

// User Register Rout
router.get('/register', (req, res) =>{
  res.send('register');
})


module.exports = router;
