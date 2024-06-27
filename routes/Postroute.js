const express = require('express');
const router = express.Router();
const { authMiddleware, admin } = require('../middleware/auth');
const { createPost, getAllPosts, getPostById, updatePost, deletePost } = require('../controllers/Postcontroller');
const createMulterStorage = require('../multer/multerConfig');
const uploadPostImage = createMulterStorage('uploads/post/');

router.post('/createPost', authMiddleware,uploadPostImage.single("postimage"), createPost);
router.get('/getPost', getAllPosts);
router.get('/:id', getPostById);
router.put('/updatePost', authMiddleware, updatePost);
router.delete('/deletePost', authMiddleware, deletePost);

module.exports = router;
