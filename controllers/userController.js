const userModel = require('../models/usermodel');
const postModel = require('../models/post');

const debug = require('debug')("development:userController");

exports.home = async (req, res) => {
    try {
        // let user = await userModel.findOne({ email : req.user.email });
        let user =  await userModel.findOne({ _id: req.user._id })

        const allposts = await Promise.all(
            user.notifications.map(id => postModel.findById(id).catch(err => null)) // Handle errors gracefully
        );

        const allPostWithUser = [];
        
        // Use for...of instead of forEach to properly wait for the async calls
        for (const post of allposts) {
            if (!post) continue; // Skip if the post is null
            try {
                const user1 = await userModel.findById(post.userid); // Fetch user info for each post
                if (user1) {
                    allPostWithUser.push({ 
                        user: user1, 
                        post: post ,        
                    });
                    // console.log(post) ;
                }
            } catch (error) {
                console.error('Error fetching user for post:', post._id, error);
            }
        }
        // console.log(allPostWithUser)
        res.render('home', {
          mode: 'home',
          user ,
          allPostWithUser
        });
      } catch (error) {
        debug('home page', error);
        res.status(500).send('Internal Server Error');
      }    
};

// exports.profileChange = async (req , res) =>{
//     try{
//         let user =  await userModel.findOne({ email: req.user.email })
//         const file = req.file ;

//         if (!file) {
//             return res.status(400).send('No file uploaded.');
//         }

//         debug("post done") ;
//     }catch (error) {
//         debug("Post ERROR") ;
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// } ;

exports.explore = async (req, res) => {
    try {
        // let user = await userModel.findOne({ email : req.user.email });
        let user =  await userModel.findOne({ _id: req.user._id })
        .catch(err => console.error(err));
       
        var uniqueUsers = [] ;

        res.render('home', {
          mode: 'explore',
          uniqueUsers ,
          user, // Fallback for missing profileImage
        });
      } catch (error) {
        debug('home page', error);
        res.status(500).send('Internal Server Error');
      }  
};

exports.notifications = (req, res) => {
    res.render('home', { mode: 'notifications' });
};

exports.likes = async (req, res) => {
    try {
        // Get the current user by email
        const user = await userModel.findOne({ _id : req.user._id });

        // Get all saved posts for the user
        const allposts = await Promise.all(
            user.likes.map(id => postModel.findById(id).catch(err => null)) // Handle errors gracefully
        );

        const allPostWithUser = [];
        
        // Use for...of instead of forEach to properly wait for the async calls
        for (const post of allposts) {
            if (!post) continue; // Skip if the post is null
            try {
                const user1 = await userModel.findById(post.userid); // Fetch user info for each post
                if (user1) {
                    allPostWithUser.push({ 
                        user: user1, 
                        post: post ,        
                    });
                    // console.log(post) ;
                }
            } catch (error) {
                console.error('Error fetching user for post:', post._id, error);
            }
        }
 
        res.render('home', {
            mode: 'likes',
            user, 
            allPostWithUser
        });
    } catch (error) {
        console.error('Error in save page:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.save = async (req, res) => {
    try {
        // Get the current user by email
        const user = await userModel.findOne({ _id : req.user._id });

        // Get all saved posts for the user
        const allposts = await Promise.all(
            user.saved.map(id => postModel.findById(id).catch(err => null)) // Handle errors gracefully
        );

        const allPostWithUser = [];
        
        // Use for...of instead of forEach to properly wait for the async calls
        for (const post of allposts) {
            if (!post) continue; // Skip if the post is null
            try {
                const user1 = await userModel.findById(post.userid); // Fetch user info for each post
                if (user1) {
                    allPostWithUser.push({ 
                        user: user1, 
                        post: post ,        
                    });
                    // console.log(post) ;
                }
            } catch (error) {
                console.error('Error fetching user for post:', post._id, error);
            }
        }
 
        res.render('home', {
            mode: 'save',
            user, 
            allPostWithUser
        });
    } catch (error) {
        console.error('Error in save page:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.review = (req, res) => {
    res.render('home', { mode: 'review' });
};

exports.setting = (req, res) => {
    res.render('setting');
};

exports.shareWeb = (req, res) => {
    res.render('share_option');
};

exports.profileWithId = async (req, res) => {
    // res.render('home', { mode: 'profile' });
    try {
        const { userid } = req.params;
        
        let user =  await userModel.findOne({ _id : req.user._id })
        .catch(err => console.error(err));
       
        let profileUser1 = await userModel.findById(userid) ; 

        const profilePostIds = profileUser1.post;
        const profileFollowerIds = profileUser1.followers;
        const profileFollowingIds = profileUser1.following;

        // Using Promise.all() to get all posts, followers, and following in parallel
        const allposts = await Promise.all(
            profilePostIds.map(id => postModel.findById(id).catch(err => null))
        );
        
        const allfollowers = await Promise.all(
            profileFollowerIds.map(id => userModel.findById(id).catch(err => null))
        );
        
        const allfollowing = await Promise.all(
            profileFollowingIds.map(id => userModel.findById(id).catch(err => null))
        );
        
        let profileUser = {
            _id : profileUser1._id ,
            username : profileUser1.username ,
            name : profileUser1.name ,
            bio : profileUser1.bio ,
            backgroundImage : profileUser1.backgroundImage , 
            profileImage : profileUser1.profileImage ,
            allposts ,
            allfollowers ,
            allfollowing
        } 
        

        res.render('home', {
            mode : 'profile' ,
            user , 
            profileUser
            // mode: 'profile',
            // profileId : userid,
            // userId : user._id ,
            // username : user.username,
            // name,
            // postNo,
            // followersNo,
            // followingNo,
            // profileImage , // Fallback for missing profileImage
            // profileUsername, // Visited user's data
            // profileName, 
            // backgroundImage, 
            // profileImage1, 
            // profileBio, 
            
            //// allposts: allposts.filter(post => post !== null), // Filter out any failed fetches
            // allfollowers: allfollowers.filter(follower => follower !== null),
            // allfollowing: allfollowing.filter(following => following !== null),
          });

    } catch (err){
        debug("Profile With Id prob") ;
        res.status(500).render('error', { message: 'Server error' });
    }
};

exports.profile = (req, res) => {
    res.redirect(`/user/profile/${req.user._id}`);
};

exports.help = (req, res) => {
    res.render('help');
};

exports.deleteAccount = (req, res) => {
    res.render('delete');
};

exports.change = (req, res) => {
    res.render('change');
};

exports.mail = (req, res) => {
    res.render('mailToMe');
};

exports.search = async (req, res) => {
    try {
        const searchTerm = req.body.searchItem;

        // Perform a case-insensitive search in multiple fields
        const users = await userModel.find({
            $or: [
                { username: { $regex: searchTerm, $options: 'i' } },
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ]
        });

        const uniqueUsers = [...new Map(users.map(user => [user._id.toString(), user])).values()];

        let user =  await userModel.findOne({ email: req.user.email })
        .catch(err => console.error("userController search " , err));

        console.log(user.username); // For debugging
        res.render('home', {
          mode : "explore",
          user , // Fallback for missing profileImage
          uniqueUsers
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.logout = async (req, res) => {
    let user =  await userModel.findOne({ _id: req.user._id })
    res.render('logout_page' , {user});
};