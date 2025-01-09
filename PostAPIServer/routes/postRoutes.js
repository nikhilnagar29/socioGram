const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// Fetch post by ID
router.get('/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const user = await User.findById(post.userid);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            postId: post._id,
            content: post.content,
            likes: post.likes ,
            image: post.image
                ? `data:${post.image.contentType};base64,${post.image.data.toString('base64')}`
                : null,
            user: {
                userID: user._id ,
                username: user.username,
                name: user.name,
                profileImage: `data:${user.profileImage.contentType};base64,${user.profileImage.data.toString('base64')}`,
            },
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
