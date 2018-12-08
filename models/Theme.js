const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Criando um Schema
const ThemeSchema = new Schema({
  curso: {
    type: Array,
    required: true
  }
});
 
mongoose.model('themes', ThemeSchema);