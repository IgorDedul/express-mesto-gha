const User = require('../models/user');


//Возвращает всех пользователей
const getUsers = (req, res) => {
  return User.find({})
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch((err) => res.status(500).send('Ошибка сервера'));
};

//Возвращает пользователя по _id
const getUser = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send('Пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => res.status(500).send('Ошибка сервера'));
};

//Создаёт пользователя
const createUser = (req, res) => {
  return User.create({...req.body})
    .then((user) => {
      return res.status(201).send(user);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send('Ошибка сервера');
    });
};

/**
// Обновление профиля
const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send('Пользователь не найден');
      }

      return res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send('Переданы некорректные данные в метод обновления профиля пользователя');
      }

      return res.status(500).send('Ошибка сервера');
    });
};

// Обновление аватара
const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send('Пользователь не найден');
      }

      return res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send('Переданы некорректные данные в метод обновления аватара пользователя');
      }

      return res.status(201).send(user);
    });
};
**/

module.exports = {
  getUsers,
  getUser,
  createUser,
  //updateProfile,
  //updateAvatar,
};