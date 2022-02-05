const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Criando um Schema
const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  developer: {
    type: Boolean,
    required: true
  }
});
mongoose.model('users', UserSchema);