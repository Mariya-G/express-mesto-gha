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
  return userModal.findUserByCredentials(email, password)
    .then((user) => {
      bcrypt.compare(password, user.password, () => {
        const token = jwt.sign({ _id: user.id }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(OK).cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: 'none', secure: true,
        }).send({ token });
      });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => userModal.create({
      name, about, avatar, email, password: hash,
    }))
    .then((data) => res.status(CREATED).send({
      email: data.email, name: data.name, about: data.about, avatar: data.avatar,
    }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные пользователя'));
      } else if (error.code === 11000) {
        next(new Conflict('Такой пользователь уже существует!'));
      } else {
        next(error);
      }
    });
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
        next(new NotFound('Пользователь по указанному _id не найден.'));
      } else {
        res.status(OK).send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new NotFound('Переданы некорректные данные пользователя'));
      } else {
        next(error);
      }
    });
};

const getAuthUser = (req, res, next) => {
  userModal.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userID = req.user._id;
  userModal.findByIdAndUpdate(userID, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        next(new NotFound('Пользователь по указанному _id не найден.'));
      } else {
        res.send({ data: user });
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(error);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userID = req.user._id;
  userModal.findByIdAndUpdate(userID, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        next(new NotFound('Пользователь по указанному _id не найден.'));
      } else {
        res.send({ data: user });
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  login,
  createUser,
  getUser,
  getAuthUser,
  getUsers,
  updateUser,
  updateAvatar,
};
