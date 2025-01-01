const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Import the controller object
const { isLoggedIn } = require('../middlewares/isLoggedIn'); // Import the isLoggedIn middleware

// Routes for div1 navigations
router.get('/home', isLoggedIn, userController.home);
router.get('/explore', isLoggedIn, userController.explore);
router.get('/notifications', isLoggedIn, userController.notifications);
router.get('/likes', isLoggedIn, userController.likes);
router.get('/save', isLoggedIn, userController.save);
router.get('/review', isLoggedIn, userController.review);
router.get('/setting', isLoggedIn, userController.setting);
router.get('/share-web', isLoggedIn, userController.shareWeb);
router.get('/log-out', isLoggedIn, userController.logout);
router.get('/profile/:userid', isLoggedIn, userController.profileWithId);
router.get('/profile', isLoggedIn, userController.profile);
router.get('/help', isLoggedIn, userController.help);
router.get('/delete', isLoggedIn, userController.deleteAccount);
router.get('/change', isLoggedIn, userController.change);
router.get('/mail', isLoggedIn, userController.mail);

router.post('/search' , isLoggedIn , userController.search) ;

module.exports = router;
