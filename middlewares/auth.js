const jwt = require('jsonwebtoken');

const ErrorAuth = require('../errors/err_auth');

const JWT_SECRET = 'some-secret-key';

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return next(new ErrorAuth('Передан неверный логин или пароль'));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
