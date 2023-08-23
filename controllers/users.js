const userModal = require('../models/user');

const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const ERROR_CODE = 500;

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return userModal.create({ name, about, avatar })
    .then((dataUser) => res.status(CREATED).send(dataUser))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUsers = (req, res) => {
  userModal.find({})
    .then((usersData) => res.status(OK).send(usersData))
    .catch(() => res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' }));
};

const getUser = (req, res) => {
  const { userID } = req.params;
  return userModal.findById(userID)
    .then((user) => {
      if (user === null) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(OK).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
      }
      return res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  const userID = req.user._id;
  userModal.findByIdAndUpdate(userID, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  const userID = req.user._id;
  userModal.findByIdAndUpdate(userID, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      console.log(error);
      if (error.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  createUser,
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
};
