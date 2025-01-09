const express = require('express');
const router = express.Router();
// const Post = require('../models/Post');
const User = require('../models/User');

// Fetch post by ID
router.get('/:userId', async (req, res) => {
    try {
        // console.log("yes call") ;
        const { userId } = req.params;

        const user = await User.findById(userId).select('_id name username profileImage'); // Include specific fields

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ 
            user: {
                _id : user._id ,
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
