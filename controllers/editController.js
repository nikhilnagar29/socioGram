const userModel = require('../models/usermodel');
const debug = require('debug')("development:postController");

exports.showFiller = async (req, res) => {
    try {
        // Wait for the user data to be fetched
        const user = await userModel.findById(req.user._id);

        // Set default values for undefined fields
        const {
            
            username = '',
            name = '',
            bio = 'No bio provided', // Default bio if undefined
            gender = 'other', // Default gender
            dateOfBirth = '', // Default as empty string (can be replaced with default date)
            location = 'Unknown', // Default location
            profileImage = '/image/default-profile.png', // Default profile image
            backgroundImage = '/image/default-background.jpg' // Default background image
        } = user || {}; // Handle case when user is null

        // console.log({
        //     username,
        //     name,
        //     bio,
        //     gender,
        //     dateOfBirth,
        //     location,
        //     profileImage,
        //     backgroundImage
        // })
        res.render('change', {
            username,
            name,
            bio,
            gender,
            dateOfBirth,
            location,
            profileImage,
            backgroundImage
        });
    } catch (error) {
        debug('Error in showFiller:', error);
        res.status(500).send('Server Error');
    }
};


exports.uploadProfileImage = async (req,res)=>{
    try {

        const userId = req.user._id; // Assuming you have user authentication
        const file = req.file;
        // console.log("i am here" , file ) ;
        let user = await userModel.findById(userId) ;
        // If no image is provided, noImage is true
        
        user.profileImage = {
            data: file.buffer,
            contentType: file.mimetype
        };

        await user.save() ;  

        res.redirect('/user/profile');
        // res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.uploadBackgroundImage = async (req,res)=>{
    try {

        const userId = req.user._id; // Assuming you have user authentication
        const file = req.file;
        // console.log("i am here" , file ) ;
        let user = await userModel.findById(userId) ;
        // If no image is provided, noImage is true
        
        user.backgroundImage = {
            data: file.buffer,
            contentType: file.mimetype
        };

        await user.save() ;  

        res.redirect('/user/profile');
        // res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.changeDeatails = async (req , res)=>{
    try {
        const userId = req.user._id; // Assuming you have user authentication
        const {username , name , bio , gender , dateOfBirth , location} = req.body ;
        // const file = req.file;
        // console.log("i am here" , file ) ;
        let user = await userModel.findById(userId) ;
        // If no image is provided, noImage is true
        
        user.username = username ;
        user.name = name ;
        user.bio = bio ;
        user.gender = gender ;
        user.dateOfBirth = dateOfBirth ; 
        user.location = location ;

        await user.save() ;  

        res.redirect('/user/profile');
        // res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

