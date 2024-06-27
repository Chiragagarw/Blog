const express = require('express');
const router = express.Router();
const multer = require('multer');
const { register, login } = require('../controllers/Usercontroller');
const createMulterStorage = require('../multer/multerConfig');
const uploadProfileImage = createMulterStorage('uploads/user/');

router.post('/register',uploadProfileImage.single("profileimage"), register);
router.post('/login', login);

module.exports = router;
