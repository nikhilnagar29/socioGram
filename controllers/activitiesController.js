const debug = require('debug')("development:activitiesController");
const userModel = require('../models/usermodel');
const commentModel = require('../models/comment')
const postModel = require('../models/post') ;
const mongoose = require('mongoose');

exports.follow = async (req, res) => {
    try {
        const opponentId = req.params.id;
        const userId = req.user._id;

        
        if (!mongoose.Types.ObjectId.isValid(opponentId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        
        const [opponent, user] = await Promise.all([
            userModel.findById(opponentId), 
            userModel.findById(userId)
        ]);

        if (!opponent || !user) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        if (opponent.followers.includes(userId)) {
            return res.status(400).json({ message: 'You are already following this user' });
        }

        
        opponent.followers.push(userId);
        user.following.push(opponentId);

        
        await Promise.all([opponent.save(), user.save()]);

        debug(`User ${userId} followed ${opponentId}`);
        
        res.redirect(`/user/profile/${opponentId}`);
    } catch (err) {
        debug('ERR', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.unfollow = async (req, res) => {
    try {
        const opponentId = req.params.id; 
        const userId = req.user._id; 

        // ✅ 1. Validate input (Check if IDs are valid ObjectIds)
        if (!mongoose.Types.ObjectId.isValid(opponentId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // ✅ 2. Fetch user and opponent concurrently
        const [opponent, user] = await Promise.all([
            userModel.findById(opponentId), 
            userModel.findById(userId)
        ]);

        if (!opponent || !user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // ✅ 3. Check if the user is actually following the opponent
        if (!opponent.followers.includes(userId)) {
            return res.status(400).json({ message: 'You are not following this user' });
        }

        // ✅ 4. Remove userId from opponent's followers and opponentId from user's following
        opponent.followers = opponent.followers.filter(id => id.toString() !== userId.toString());
        user.following = user.following.filter(id => id.toString() !== opponentId.toString());

        // ✅ 5. Save both user and opponent concurrently
        await Promise.all([opponent.save(), user.save()]);

        debug(`User ${userId} unfollowed ${opponentId}`);

        res.redirect(`/user/profile/${opponentId}`);
    } catch (err) {
        debug('ERR', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.savePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.postId;

        const user = await userModel.findById(userId);
        
        if (!user.saved.includes(postId)) {
            user.saved.push(postId);
            await user.save();
        }

        res.status(200).json({ message: 'Post saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to save post', error: error.message });
    }
}

exports.unsavePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.postId;

        const user = await userModel.findById(userId);
        user.saved = user.saved.filter(id => id.toString() !== postId);
        await user.save();

        res.status(200).json({ message: 'Post unsaved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to unsave post', error: error.message });
    }
}

exports.comment = async (req, res) => {
    try {
        // Step 1: Get the user and postId from the request
        const user = await userModel.findById(req.user._id);
        const postId = req.params.postId;
        
        // Validate if postId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        // Step 2: Find the post by ID
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const { content } = req.body;

        // Step 3: Validate comment content
        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Comment content cannot be empty' });
        }

        // Step 4: Create a new comment
        const newComment = await commentModel.create({
            userid: user._id,
            postid: post._id, // Use post._id, which is already an ObjectId
            content: content.trim()
        });

        // Step 5: Add the comment to the post's comments array
        post.comments.push(newComment._id);
        await post.save();

        // Step 6: Redirect or return a response
        res.redirect(`/post/${postId}`);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Failed to create comment', error: error.message });
    }
};




exports.commentLike = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user._id;

        const update = await commentModel.findByIdAndUpdate(
            commentId, 
            { 
                $addToSet: { likes: userId } 
            }, 
            { new: true, upsert: false } // upsert ensures it doesn't create a new one
        );

        if (!update) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const hasLiked = update.likes.includes(userId);
        if (hasLiked) {
            await commentModel.findByIdAndUpdate(commentId, { $pull: { likes: userId } });
        }

        res.status(200).json({
            isLiked: !hasLiked,
            likeCount: update.likes.length
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
