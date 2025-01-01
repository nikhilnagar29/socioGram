// Import necessary modules
const express = require('express');
require('dotenv').config(); 
const usermodel = require('./models/usermodel');
const user = usermodel;
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const path = require('path');
const redis = require('redis');    
const { promisify } = require('util'); 
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const db = require('./config/mongoose-connection') ;
const authRoutes = require('./routes/auth') 
const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')
const editRoutes = require('./routes/edit')
const logRoutes = require('./routes/log') 
const activitiesRoutes = require('./routes/activities')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(cookieParser()); // Corrected to call cookieParser()

// Redis client

app.use('/' , authRoutes);

app.use('/user' , userRoutes);

app.use('/post', postRoutes);

app.use('/edit' , editRoutes) ;

app.use('/log' , logRoutes) ;

app.use('/activities' , activitiesRoutes) ;

app.get('/signin' , (req,res)=>{
    res.render('signin.ejs') ;
})



app.listen(3000) ;

