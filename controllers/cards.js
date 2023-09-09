const cardModal = require('../models/card');

const OK = 200;
const CREATED = 201;

const NotFound = require('../errors/not_found'); // 404
const Forbidden = require('../errors/forbidden'); // 403
const BadRequest = require('../errors/bad-request'); // 400

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  return cardModal.create({ name, link, owner })
    .then((dataCards) => res.status(CREATED).send(dataCards))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      }
      next(error);
    });
};

const getCards = (req, res, next) => {
  cardModal.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch((error) => {
      next(error);
    });
};

const deleteCard = (req, res, next) => {
  cardModal.findById(req.params.cardId)
    .orFail(new NotFound('Карточка не найдена'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new Forbidden('Нельзя удалить чужую карточку');
      }
      return res.status(OK).send({ data: card });
    })
    .then((card) => {
      if (card === null) {
        throw new Forbidden('Нельзя удалить чужую карточку');
      }
      return res.status(OK).send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Карточка с указанным _id не найдена'));
      }
      next(error);
    });
};

const likeCard = (req, res, next) => cardModal.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card) {
      return res.status(OK).send({ data: card });
    }
    throw new NotFound('Передан несуществующий _id карточки');
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      next(new BadRequest('Переданы некорректные данные для постановки лайка'));
    }
    next(error);
  });

const dislikeCard = (req, res, next) => cardModal.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card) {
      return res.status(OK).send({ data: card });
    }
    throw new NotFound('Передан несуществующий _id карточки');
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      next(new BadRequest('Переданы некорректные данные для постановки лайка'));
    }
    next(error);
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
