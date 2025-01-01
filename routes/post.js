const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../utils/multerUtil');
const { isLoggedIn } = require('../middlewares/isLoggedIn');

// Route to create a post
router.post('/create', isLoggedIn , upload.single('image') , postController.createPost);

// Route to view a single post
router.get('/:postId', isLoggedIn ,postController.getPost);

router.post('/delete/:postId' , isLoggedIn ,postController.deletePost );

router.post('/like/:postId' , isLoggedIn , postController.likePost) ;

module.exports = router;
