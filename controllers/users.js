const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModal = require('../models/user');

const NotFound = require('../errors/not_found'); // 404
const Conflict = require('../errors/conflict'); // 409
const BadRequest = require('../errors/bad-request'); // 400

const SALT_ROUNDS = 10;
const JWT_SECRET = 'some-secret-key';

const OK = 200;
const CREATED = 201;

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Email или пароль не могут быть пустыми' });
  }
  return userModal.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new BadRequest('Такого пользователя не существует');
      }

      bcrypt.compare(password, user.password, (error, isValid) => {
        if (!isValid) {
          return res.status(401).send({ message: 'Пароль не верный' });
        }
        const token = jwt.sign({ _id: user.id }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(OK).cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: 'none', secure: true,
        }).send({ message: token });
      });
    })
    .catch(next);
};

// eslint-disable-next-line consistent-return
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Email или пароль не могут быть пустыми' });
  }
  bcrypt.hash(password, SALT_ROUNDS, (error, hash) => userModal.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Conflict('При регистрации указан email, который уже существует на сервере');
      }
      return userModal.create({
        name, about, avatar, email, password: hash,
      })
        .then(() => res.status(CREATED).send({ message: `Пользователь ${email} зарегестрирован` }));
    })
    // eslint-disable-next-line no-shadow
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные пользователя'));
      }
      next(error);
    }));
};

const getUsers = (req, res, next) => {
  userModal.find({})
    .then((usersData) => res.status(OK).send(usersData))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userID } = req.params;
  return userModal.findById(userID)
    .then((user) => {
      if (user === null) {
        throw new NotFound('Пользователь по указанному _id не найден.');
      }
      return res.status(OK).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные пользователя'));
      }
      next(error);
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  const userID = req.user._id;
  userModal.findByIdAndUpdate(userID, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        throw new NotFound('Пользователь по указанному _id не найден.');
      }
      return res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      }
      next(error);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userID = req.user._id;
  userModal.findByIdAndUpdate(userID, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
      }
      next(error);
    });
};

module.exports = {
  login,
  createUser,
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
};
