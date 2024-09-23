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
    userType: {
        type: String,
        default: ''
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    createdOn: {
        type: Date,
        default: Date.now()
    }
})


mongoose.model('User', userModel);