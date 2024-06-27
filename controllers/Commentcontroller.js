

const mongoose = require("mongoose");
const Comment = require('../models/Comment');
const { createError } = require('../utils/errorUtil');


exports.addComment = async (req, res, next) => {
    const { content, postId, } = req.body; 

    console.log('Received content:', content);
    console.log('Post ID:', postId);
    console.log('Author ID:', req.user.id);

    if (!postId) {
        console.error('No postId provided.');
        return res.status(400).json({ status: 400, error: "postId is required" });
    }

    if (!req.user.id) {
        console.error('No authorId provided.');
        return res.status(400).json({ status: 400, error: "authorId is required",  });
    }

    try {
        const newComment = new Comment({
            content,
            post: postId,
            author: req.user.id
           // author: username
        });

        console.log('New comment object:', newComment);

        await newComment.save();

        res.status(201).json({ status: 201, message: "Comment added successfully", data: newComment });
    } catch (error) {
        res.status(400).json({ status: 400, message: "Error adding comment", error });
    }
};

// exports.getComments = async (req, res, next) => {
//     try {
//         const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username').exec();
//         res.json(comments);
//     } catch (err) {
//         next(err);
//     }
// };

exports.getComments = async (req, res, next) => {
    try {
        const postId = new mongoose.Types.ObjectId(req.params.postId);

        const comments = await Comment.aggregate([
            {
                $match: { post: postId }
            },
            {
                $lookup: {
                    from: 'users', // Assuming 'users' is the name of your user collection
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $unwind: '$author'
            },
            {
                $project: {
                    _id: 1,
                    content: 1,
                    author: { username: 1 }
                    // Add more fields from Comment if needed
                }
            }
        ]);

        res.status(201).json({status:201, message: "get all comment", Data: comments});
    } catch (error) {
        res.status(400).json({status:400, message:"error", error });
    }
};
