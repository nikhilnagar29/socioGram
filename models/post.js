// const { request } = require('express');
const mongoose = require('mongoose') ;

const postSchema = mongoose.Schema({
    userid : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'user' 
    } ,
    content : {
        type : String ,
        require : true 
    } ,
    createdAt : {
        type : Date ,
        default : Date.now 
    } ,
    noImage: {
        type: Boolean,
        default: true 
    },
    image : {
        data: Buffer,
        contentType: String,
    } ,

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],

    visibility: { type: String, enum: ['public', 'private', 'followers'], default: 'public' },
    
})

const post = mongoose.model('post' , postSchema) ;
module.exports = post ;