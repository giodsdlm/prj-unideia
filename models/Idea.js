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
  autor: {},
  user: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String
  },
  likes_count: {
    type: Number
  }
});

mongoose.model('ideas', IdeaSchema);