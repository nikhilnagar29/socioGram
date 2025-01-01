// const { request } = require('express');
const mongoose = require('mongoose') ;
const config = require('config') ;

const dbgr = require('debug')("development:mongoose");

try{
    mongoose.connect(config.get("MONGODB_URI")) ;
    dbgr('mongoos connected')
}catch{
    dbgr('problem in mongoos') 
    return res.status(500).json({ message: 'Data Base problem' });
}

module.exports = mongoose.connection