const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;


const artModel = new Schema({
    artName: {
        type: String,
        default: ''
    },
    createdBy: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: ''
    },
    ownerName: {
        type: String,
        default: ''
    },
    createdOn: {
        type: String,
        default: null
    },
    completedOn: {
        type: String,
        default: null
    },
    timeTaken: {
        type: Object,
        default: null
    }
})


mongoose.model('Art', artModel);