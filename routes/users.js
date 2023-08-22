const router = require('express').Router();

const {
  getUsers,
  getUser,
  getMe,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUser);

router.get('/users/me', getMe);

router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;