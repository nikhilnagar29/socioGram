const express = require('express');
const routes = express.Router();
const { isLoggedIn } = require('../middlewares/isLoggedIn'); // Import the isLoggedIn middleware
const logController = require('../controllers/logController')
const upload = require('../utils/multerUtil');

routes.get('/out', isLoggedIn , logController.logout) ;

routes.post('/in' , logController.login) ;

routes.get('/delete', isLoggedIn , logController.deletePageGo) ;

routes.post('/delete/:id', isLoggedIn , logController.delete) ;

module.exports = routes;
