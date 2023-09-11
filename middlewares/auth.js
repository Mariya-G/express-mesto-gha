const jwt = require('jsonwebtoken');

const ErrorAuth = require('../errors/err_auth');

const JWT_SECRET = 'some-secret-key';

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new ErrorAuth('Передан неверный логин или пароль1'));
    return;
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    next(new ErrorAuth('Передан неверный логин или пароль2'));
    return;
  }

  req.user = payload;

  return next();
};

module.exports = auth;
