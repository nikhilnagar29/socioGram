// const { request } = require('express');
const mongoose = require('mongoose') ;

const otpSchema = mongoose.Schema({
    email : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'user' 
    } ,
    otp : String , 
    expiry : {
        type : Date ,
        default : Date.now 
    } 
})

const otp = mongoose.model('otp' , otpSchema) ;
module.exports = otp ;