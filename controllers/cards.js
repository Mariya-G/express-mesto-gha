const cardModal = require('../models/card');

const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const ERROR_CODE = 500;

const createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  return cardModal.create({ name, link, owner: _id })
    .then((dataCards) => res.status(CREATED).send(dataCards))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const getCards = (req, res) => {
  cardModal.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch((error) => {
      console.log(error);
      return res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  cardModal.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(OK).send({ data: card });
    })
    .catch((error) => {
      console.log(error);
      if (error.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const likeCard = (req, res) => cardModal.findByIdAndUpdate(
  req.params.cardId,
  // eslint-disable-next-line no-underscore-dangle
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card) {
      return res.status(OK).send({ data: card });
    }
    return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
    }
    return res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  });

const dislikeCard = (req, res) => cardModal.findByIdAndUpdate(
  req.params.cardId,
  // eslint-disable-next-line no-underscore-dangle
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card) {
      return res.status(OK).send({ data: card });
    }
    return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
    }
    return res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
