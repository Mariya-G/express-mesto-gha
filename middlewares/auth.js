const jwt = require('jsonwebtoken');

const ErrorAuth = require('../errors/err_auth');

const JWT_SECRET = 'some-secret-key';

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Передан неверный логин или пароль' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    next(new ErrorAuth('Передан неверный логин или пароль'));
  }

  req.user = payload;

  next();
};

module.exports = auth;
