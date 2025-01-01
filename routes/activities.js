const express = require('express');
const routes = express.Router();
const { isLoggedIn } = require('../middlewares/isLoggedIn'); // Import the isLoggedIn middleware
const activitiesController = require('../controllers/activitiesController')


routes.post('/follow/:id' , isLoggedIn , activitiesController.follow );
routes.post('/unfollow/:id' , isLoggedIn , activitiesController.unfollow );

routes.post('/save/:postId' , isLoggedIn , activitiesController.savePost) ; 
routes.post('/unsave/:postId' , isLoggedIn , activitiesController.unsavePost) ; 

routes.post('/comment/:postId' , isLoggedIn , activitiesController.comment) ;

routes.post('/like/:commentId' , isLoggedIn , activitiesController.commentLike) ;

module.exports = routes;
