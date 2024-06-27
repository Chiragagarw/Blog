const express = require('express');
const router = express.Router();
const { authMiddleware, admin } = require('../middleware/auth');
const { addComment, getComments } = require('../controllers/Commentcontroller');

router.post('/addcomments', authMiddleware, addComment);
router.get('/:postId/getcomments', getComments);

module.exports = router;
