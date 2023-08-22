const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/UnauthorizedError');

const { secretKey = 'SECRET_KEY' } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  return next();
};
