const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: 
    { 
        type: String, 
        required: true 
    },
    content: 
    { 
        type: String, 
        required: true 
    },
    tags: [String],

    author: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    createdAt: 
    { 
        type: Date, 
        default: Date.now 
    },
    
    updatedAt: { type: Date },
    postimage:
    {
        type: String
    }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
