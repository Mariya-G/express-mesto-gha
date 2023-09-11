const jwt = require('jsonwebtoken');

const ErrorAuth = require('../errors/err_auth');

const JWT_SECRET = 'some-secret-key';

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new ErrorAuth('Ошибка'));
  }
  const jwtToken = token.replace('***', '');
  let payload;
  try {
    payload = jwt.verify(jwtToken, JWT_SECRET);
  } catch (error) {
    next(new ErrorAuth('Передан неверный логин или пароль'));
    return;
  }

  req.user = payload;

  next();
};

module.exports = auth;
