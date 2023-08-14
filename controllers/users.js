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
  return User.findById(req.params)
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
  const {
    name, about, avatar
  } = req.body;

  return User.create({name, about, avatar})
    .then((user) => {
      return res.status(201).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(400).send('Переданы некорректные данные в метод создания пользователя');
      }
      if (err.name === 'CastError') {
        return res.status(400).send('Переданы некорректные данные в метод создания пользователя');
      }
    return res.status(500).send('Ошибка сервера');
    });
};

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


module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
};