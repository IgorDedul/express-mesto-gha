const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');

const { secretKey = 'SECRET_KEY'} = process.env;

//  Возвращает всех пользователей
const getUsers = (req, res, next) => {
  return User.find({})
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch((err) => {next(err)});
};

//  Возвращает пользователя по _id
const getUser = (req, res, next) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Ошибка валидации'));
      }
      return next(err);
  });
};

//  Создаёт пользователя
const createUser = (req, res, next) => {
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
        return next(new ValidationError('Переданы некорректные данные'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Такой пользователь уже существует'));
      }
      return next(err);
    });
};

// Получение информации о пользователе
const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Некорректный id пользователя'));
      }
      return next(err);
    });
};

// Обновление профиля
const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные в метод обновления профиля пользователя'));
      }
      return next(err);
    });
};

// Обновление аватара
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные в метод обновления аватара пользователя'));
      }
      return next(err);
    });
};

// Аунтификация
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new ForbiddenError('Такого пользователя не существует');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные логин или пароль');
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