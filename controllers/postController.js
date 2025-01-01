const userModel = require('../models/usermodel');
const debug = require('debug')("development:postController");
const mongoose = require('mongoose');
const commentModel = require('../models/comment') ;

const Post = require('../models/post');

exports.createPost = async (req, res) => {
    try {
        const { content, visibility } = req.body;
        const userId = req.user._id; 
        const file = req.file;

        // Get the user once instead of querying it multiple times
        let user1 = await userModel.findById(userId);

        // Prepare the post data
        const newPostData = {
            userid: userId,
            content: content,
            visibility: visibility || 'public',
            noImage: true 
        }; 

        // If an image is uploaded, update the image field
        if (file) {
            newPostData.image = {
                data: file.buffer,
                contentType: file.mimetype
            };
            newPostData.noImage = false; 
        }

        // Create and save the post
        const newPost = new Post(newPostData);
        await newPost.save();

        // Update the user's post array
        user1.post.push(newPost._id);
        user1.notifications.push(newPost._id);
        await user1.save();

        // Notify followers about the new post
        for (const id of user1.followers) {
            try {
                const follower = await userModel.findById(id);
                if (follower) {
                    follower.notifications.push(newPost._id);
                    await follower.save();
                }
            } catch (error) {
                console.error(`Error notifying follower ${id}:`, error);
            }
        }

        // Redirect after all notifications are done
        res.redirect('/user/home');
    } catch (error) {
        console.error('Error in createPost:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getPost = async (req, res) => {
    try {
        // Step 1: Get the current user from the database
        const user = await userModel.findOne({ email: req.user.email });

        // Step 2: Validate the post ID and query the Post, its comments, and the post's user
        const postId = req.params.postId;

        // Validate if postId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        // Step 3: Query the post with its associated user and comments (and their user info)
        const post = await Post.findById(postId)
            .populate({
                path: 'comments', 
                populate: { path: 'userid', select: 'username name profileImage' }
            })
            .populate('userid', 'username name profileImage'); // Get info for the user who made the post

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Step 4: Extract user information from the post's comments and prepare for rendering
        const allinfo = post.comments.map(comment => ({
            content: comment.content,
            time: comment.createdAt,
            likes: comment.likes,
            commentId: comment._id,
            userId: comment.userid._id,
            username: comment.userid.username,
            name: comment.userid.name,
            profileImage: comment.userid.profileImage
        }));

        // console.log(allinfo) ;

        // Step 5: Render the home page with post info, comments, and the user who made the post
        res.render('home', {
            user,
            post,
            userThatPost: post.userid, // Since we populated 'userid' for the post
            mode: 'post',
            allinfo
        });

    } catch (error) {
        console.error('Error in getPost:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.deletePost = async (req, res) => {
    try {
        const userId = req.user._id; 
        const postId = req.params.postId; // Use `params` instead of `param`

        const user = await userModel.findById(userId); 
        console.log("hello", { user , postId});

        // Filter out the postId from the user's post array
        user.post = user.post.filter(id => id.toString() !== postId.toString());
        await user.save();

        console.log("Post deleted from user posts array");

        // Delete the post from the posts collection
        await Post.findByIdAndDelete(postId);
        res.redirect('/user/profile');
        
    } catch (error) { // Add `error` parameter to capture thrown errors
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        // ✅ 1. Validate the postId and userId early
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        // ✅ 2. Find the post and user in parallel (faster than finding them sequentially)
        const [post, user] = await Promise.all([
            Post.findById(postId),
            userModel.findById(userId)
        ]);

        // console.log(user.likes);

        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // ✅ 3. Check if user already liked the post
        const postLikeIndex = post.likes.findIndex(id => id.equals(userId));
        const userLikeIndex = user.likes.findIndex(id => id.equals(postId));

        if (postLikeIndex !== -1) {
            // User already liked the post, so unlike it
            post.likes.splice(postLikeIndex, 1); // Remove userId from post likes
            user.likes.splice(userLikeIndex, 1); // Remove postId from user likes
        } else {
            // User has not liked it yet, so like it
            post.likes.push(userId);
            user.likes.push(postId);
        }

        // ✅ 4. Save both user and post in parallel
        await Promise.all([post.save(), user.save()]);

        // ✅ 5. Respond with success message and new like count
        res.status(200).json({ 
            message: 'Like status updated', 
            likeCount: post.likes.length,
            liked: post.likes.includes(userId) 
        });

    } catch (err) {
        console.error('Error in likePost:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

