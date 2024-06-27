
const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User')
const { createError } = require('../utils/errorUtil');

exports.createPost = async (req, res, next) => {
    const { title, content, tags } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        const newPost = new Post({
            title,
            content,
            tags,
            author: req.user.id
        });
        if (req.file) {
            newPost.postimage = req.file.path;
            }

        await newPost.save();
        res.status(201).json({status: 201, message: "post created successfully", Data: newPost});
    } catch (error) {
        res.status(400).json({status:400, message:"there is an error", error });
    }
};

// exports.getAllPosts = async (req, res, next) => {
//     try {
//         const posts = await Post.aggregate([
//             {
//                 $lookup: {
//                     from: 'users',  // Assuming 'users' is the collection where authors are stored
//                     localField: 'author',
//                     foreignField: '_id',
//                     as: 'author',
//                 }
//             },
//             {
//                 $unwind: '$author'  // Unwind the 'author' array created by $lookup
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     title: 1,
//                     content: 1,
//                     tags: 1,
//                     'author.username': 1,
//                     'author._id': 1

//                 }
//             }
//         ]).exec();
//         res.json({ status: 200, message: "get all posts", Data: posts });
//     } catch (error) {
//         res.status(400).json({ status: 400, message: "there is an error", error });
//     }
// };

exports.getAllPosts = async (req, res, next) => {
    try {
        const { title, tags } = req.query;

        const matchConditions = {};
        if (title) {
            matchConditions.title = { $regex: title, $options: 'i' }; // Case-insensitive regex search for title
        }
        if (tags) {
            matchConditions.tags = { $in: tags.split(',') }; 
        }

        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: 'users',  
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                }
            },
            {
                $unwind: '$author'  // Unwind the 'author' array created by $lookup
            },
            {
                $match: matchConditions  
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    tags: 1,
                    'author.username': 1,
                    'author._id': 1
                }
            }
        ]).exec();

        res.json({ status: 200, message: "Get all posts", data: posts });
    } catch (error) {
        res.status(400).json({ status: 400, message: "There was an error", error });
    }
};


exports.getPostById = async (req, res, next) => {
    try {
        const postId = new mongoose.Types.ObjectId(req.params.id);

        const post = await Post.aggregate([
            { $match: { _id: postId } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorInfo'
                }
            },
            {
                $unwind: {
                    path: '$authorInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    authorInfo: {
                        username: 1
                    }
                }
            }
        ]);

        if (!post || post.length === 0) {
            return res.status(404).json({ status: 404, message: 'Post not found' });
        }

        res.status(200).json({ status: 200, message: 'Successfully retrieved post', data: post[0] });
    } catch (error) {
        console.error('Error in getPostById:', error);
        res.status(500).json({ status: 500, message: 'Internal server error', error });
    }
};


// exports.updatePost = async (req, res, next) => {
//     const { title, content, tags } = req.body;
//     console.log(req.body);

//     try {
//         console.log('Updating post with ID:', req.params.id);
//         console.log('User ID:', req.user.id);
//         const post = await Post.findOne({ _id: req.params.id, author: req.user.id });
//         if (!post) return next(createError('Post not found or unauthorized', 404));
        

//         post.title = title || post.title;
//         post.content = content || post.content;
//         post.tags = tags || post.tags;
//         post.updatedAt = Date.now();

//         await post.save();
//         res.json({status: 201, message: "update successful" ,Data: post});
//     } catch (error) {
//         res.status(400).json({status:400, message:"there is an error", error });
//     }
// };

exports.updatePost = async (req, res, next) => {
    const { postId, title, content, tags } = req.body;
    console.log(req.body);

    try {
        console.log('Updating post with ID:', postId); 
        console.log('User ID:', req.user.id);
        const post = await Post.findOne({ _id: postId, author: req.user.id }); // Finding post by postId from req.body
        if (!post) return next(createError('Post not found or unauthorized', 404));

        post.title = title || post.title;
        post.content = content || post.content;
        post.tags = tags || post.tags;
        post.updatedAt = Date.now();

        await post.save();
        res.json({ status: 201, message: "Update successful", data: post });
    } catch (error) {
        res.status(400).json({ status: 400, message: "There was an error", error });
    }
};


exports.deletePost = async (req, res, next) => {
    const postId = req.body.postId;
    try {
        
        console.log('User ID:', req.user.id);
        const post = await Post.findOne({ _id: postId, author: req.user.id });
        if (!post) return next(createError('Post not found or unauthorized', 404));

        await Post.findByIdAndDelete(postId);
        res.json({status: 201, message: 'Post removed successfully', Data: post });
    } catch (error) {
        res.status(400).json({status:400, message:"there is an error", error });
    }
};
