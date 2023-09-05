const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/', auth, usersRouter);
router.use('/', auth, cardsRouter);

router.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

module.exports = router;
