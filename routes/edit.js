const express = require('express');
const routes = express.Router();
const { isLoggedIn } = require('../middlewares/isLoggedIn'); // Import the isLoggedIn middleware
const editController = require('../controllers/editController')
const upload = require('../utils/multerUtil');
routes.get('/',isLoggedIn ,editController.showFiller) ;

routes.post('/update-profile-image', isLoggedIn , upload.single('profileImage') , editController.uploadProfileImage);

routes.post('/update-background-image', isLoggedIn , upload.single('backgroundImage') , editController.uploadBackgroundImage);

routes.post('/update-profile', isLoggedIn , editController.changeDeatails) ;
module.exports = routes;
