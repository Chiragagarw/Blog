
const express = require('express');
const router = express.Router();
const { authMiddleware, admin } = require('../middleware/auth');
const { getAllUsers, deleteUser } = require('../controllers/Admincontroller');

// router.use(authMiddleware);
// router.use(admin);

router.get('/users',authMiddleware,admin, getAllUsers);
router.delete('/users/:userId', deleteUser);

// Add more admin routes as needed

module.exports = router;
