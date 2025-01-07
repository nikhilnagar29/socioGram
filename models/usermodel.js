// const { request } = require('express');
const mongoose = require('mongoose') ;
const fs = require('fs');
const path = require('path');

// Define paths for default images
const defaultBgImagePath = path.join(__dirname, '../assets/default-bg.png');
const defaultProfileImagePath = path.join(__dirname, '../assets/default-image.png');

// Load default background image
const defaultBgImageBuffer = fs.existsSync(defaultBgImagePath)
    ? fs.readFileSync(defaultBgImagePath)
    : Buffer.from(''); // Fallback if file is missing

// Load default profile image
const defaultProfileImageBuffer = fs.existsSync(defaultProfileImagePath)
    ? fs.readFileSync(defaultProfileImagePath)
    : Buffer.from(''); // Fallback if file is missing


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
            default: defaultProfileImageBuffer 
        },
        contentType: {
            type: String,
            default: 'image/png' // Default image type
        }
    },
    backgroundImage: {
        data: {
            type: Buffer,
            default: defaultBgImageBuffer
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