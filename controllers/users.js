const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { secretKey = 'SECRET_KEY'} = process.env;

//  Возвращает всех пользователей
const getUsers = (req, res) => {
  return User.find({})
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch((err) => res.status(500).send('Ошибка сервера'));
};

//  Возвращает пользователя по _id
const getUser = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send('Пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send('Ошибка валидации');
      }
      return res.status(500).send('Ошибка сервера')
  });
};

//  Создаёт пользователя
const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({name, about, avatar, email, password: hash,}))
    .then((user) => {
      return res.status(201).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(400).send('Переданы некорректные данные');
      }
      if (err.code === 11000) {
        return res.status(409).send('Такой пользователь уже существует');
      }
      return res.status(500).send('Ошибка сервера');
    });
};

// Получение информации о пользователе
const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404).send('Пользователь не найден');
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(401).send('Некорректный id пользователя');
      }

      return next(err);
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

      return res.status(200).send(user);
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

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send('Переданы некорректные данные в метод обновления аватара пользователя');
      }

      return res.status(201).send(user);
    });
};

// Аунтификация
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(403).send('Такого пользователя не существует');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return res.status(401).send('Неправильные логин или пароль');
          }

          const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '7d' });

          res
            .cookie('jwt', token, {
              maxAge: 7 * 24 * 60 * 60 * 1000,
              httpOnly: true,
              sameSite: true,
            });
        });
    })
        .catch((err) => {
          next(err);
        });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  getMe,
  updateProfile,
  updateAvatar,
  login,
};