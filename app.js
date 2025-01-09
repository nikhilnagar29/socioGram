// Import necessary modules
const express = require('express');
require('dotenv').config(); 

const path = require('path');

const cookieParser = require('cookie-parser');
const session = require('express-session');

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

app.use(
    session({
        secret: 'your-secret-key', // Replace with a strong, unique secret
        resave: false,             // Prevent unnecessary session saves
        saveUninitialized: true,   // Save new sessions
        cookie: { 
            secure: false,         // Set to `true` if using HTTPS
            maxAge: 300000         // Session expiration time in milliseconds (e.g., 5 minutes)
        },
    })
);

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

