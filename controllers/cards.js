const cardModal = require('../models/card');

const createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  return cardModal.create({ name, link, owner: _id })
    .then((dataCards) => res.status(201).send(dataCards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const getCards = (req, res) => {
  cardModal.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const deleteCard = (req, res) => {
  cardModal.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const likeCard = (req, res, next) => cardModal.findByIdAndUpdate(
  req.params.cardId,
  // eslint-disable-next-line no-underscore-dangle
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card) {
      res.send({ data: card });
    } else {
      next();
    }
  })
  .catch((err) => {
    next(err);
  });

const dislikeCard = (req, res, next) => cardModal.findByIdAndUpdate(
  req.params.cardId,
  // eslint-disable-next-line no-underscore-dangle
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card) {
      res.send({ data: card });
    } else {
      next();
    }
  })
  .catch((err) => {
    next(err);
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
