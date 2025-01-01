// const { request } = require('express');
const mongoose = require('mongoose') ;

const commentSchema = mongoose.Schema({
    userid : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'user' ,
        required: true 
    } ,
    postid : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'post' ,
        required: true 
    } ,
    content : {
        type : String ,
        require : true 
    } ,
    createdAt : {
        type : Date ,
        default : Date.now 
    } ,

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
})

const comment = mongoose.model('comment' , commentSchema) ;
module.exports = comment ;