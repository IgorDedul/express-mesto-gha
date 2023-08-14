const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
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
  },
});

module.exports = mongoose.model('user', userSchema);