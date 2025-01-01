// const { request } = require('express');
const mongoose = require('mongoose') ;
// const { profile } = require('../controllers/userController');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    verify: {
        type: Boolean,
        default: false
    },
    profileImage: {
        data: {
            type: Buffer,
            default: Buffer.from('') // Empty buffer by default
        },
        contentType: {
            type: String,
            default: 'image/png' // Default image type
        }
    },
    backgroundImage: {
        data: {
            type: Buffer,
            default: Buffer.from('')
        },
        contentType: {
            type: String,
            default: 'image/png'
        }
    },
    password: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: 'Hello, I am a new user!'
    },
    email: {
        type: String,
        required: true
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: [] // Default to an empty array
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: []
    }],
    post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        default: []
    }],
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Non-binary', 'Other'],
        default: 'Other' // Default gender if not specified
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        default: []
    }],
    saved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        default: []
    }],
    dateOfBirth: {
        type: Date,
        default: null // Null as default if DOB is not provided
    },
    location: {
        type: String,
        default: 'Unknown'
    },
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        default: []
    }]
});

const user = mongoose.model('user' , userSchema) ;
module.exports = user ;