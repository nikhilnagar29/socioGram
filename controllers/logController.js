const debug = require('debug')("development:logController");
const bcrypt = require('bcrypt') ;
const jwt = require('jsonwebtoken');
const userModel = require('../models/usermodel')

// const config = require('config') ;

exports.logout = async (req,res)=> {
    try{
        res.cookie('token', '' , { httpOnly: true });
        debug('User logged out successfully');
        res.redirect('/') ;
    }catch (err){
        debug("ERR " , err) ;
        res.status(500).json({ message: 'Internal server error' });
    }

}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = await userModel.find({ email : email });

        if (users.length === 0) {
            return res.render('signin', { message: "User not found" });
        }

        const user = await Promise.all(
            users.map(async user => {
                const result = await bcrypt.compare(password, user.password);
                return result ? user : null;
            })
        ).then(results => results.find(user => user !== null));

        if (user) {
            const token = jwt.sign({ email: user.email, _id: user._id }, "default_secret");
            res.cookie("token", token);
            return res.redirect('/user/home'); // Response sent, exit function
        } else {
            res.render('signin', { message: "Password does not match" });
        }

    } catch (err) {
        console.error("Login Error: ", err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.deletePageGo = async (req,res) => {
    try {
        user = await userModel.findById(req.user._id)
        res.render('delete' , user);
    } catch (err) {
        console.error("delete Error: ", err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.delete = async (req,res) => {
    try {
        user = await userModel.findByIdAndDelete(req.user._id)
        res.redirect('/');
    } catch (err) {
        console.error("delete Error: ", err);
        res.status(500).json({ message: 'Internal server error' });
    }
}