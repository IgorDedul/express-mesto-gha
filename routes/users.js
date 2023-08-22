const router = require('express').Router();

const { validateUserId, validateUpdateProfile, validateUpdateAvatar } = require('../middlewares/validation');

const {
  getUsers,
  getUser,
  getMe,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', validateUserId, getUser);

router.get('/users/me', getMe);

router.patch('/me', validateUpdateProfile, updateProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;