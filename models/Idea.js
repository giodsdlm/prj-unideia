const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Criando um Schema
const IdeaSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  tema: {    
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  autor: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('ideas', IdeaSchema);