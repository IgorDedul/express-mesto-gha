const jwt = require('jsonwebtoken');

const { secretKey = 'SECRET_KEY'} = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).send('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return res.status(401).send('Необходима авторизация');
  }

  req.user = payload;

  return next();
};