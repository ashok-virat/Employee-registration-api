const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const userModel = new Schema({
    userName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: ''
    },
    createdOn: {
        type: Date,
        default: Date.now()
    }
})


mongoose.model('User', userModel);