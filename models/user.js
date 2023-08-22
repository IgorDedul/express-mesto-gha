const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь, учёный',
  },
  avatar: {
    type: String,
    default: 'https://i.pinimg.com/736x/3f/0e/65/3f0e65097bd1c16017156c2a1b4b4ba1--jacques-cousteau-costume-ideas.jpg',
    validate: {
      validator: (string) => {
        validator.isURL(string);
      },
    },
  },
  email: {
    type: String,
    validate: {
      validator: (string) => {
        validator.isEmail(string);
      },
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
