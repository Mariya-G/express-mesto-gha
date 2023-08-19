const userModal = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return userModal.create({ name, about, avatar })
    .then((dataUser) => res.status(201).send(dataUser))
    .catch((error) => {
      if (error.name === 'ErrorBadRequest') {
        return res.status(400).send({ message: 'Пользователь не создан' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const getUsers = (req, res) => {
  userModal.find({})
    .then((usersData) => res.status(200).send(usersData))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

const getUser = (req, res) => {
  const { userID } = req.params;
  return userModal.findById(userID)
    .then((user) => {
      if (user === null) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'Error') {
        return res.status(400).send({ message: 'Произошла ошибка' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  const userID = req.user._id;
  userModal.findByIdAndUpdate(userID, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  const userID = req.user._id;
  userModal.findByIdAndUpdate(userID, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = {
  createUser,
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
};
