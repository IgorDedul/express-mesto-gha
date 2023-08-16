const router = require('express').Router();

const {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.post('/users', createUser);

router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;