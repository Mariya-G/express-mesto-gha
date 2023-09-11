const router = require('express').Router();
const { validateUpdateUser, validateUserAvatar, validateId } = require('../middlewares/validators');

const {
  getAuthUser,
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getAuthUser);
router.get('/users/:userID', validateId, getUser);
router.patch('/users/me', validateUpdateUser, updateUser);
router.patch('/users/me/avatar', validateUserAvatar, updateAvatar);

module.exports = router;
