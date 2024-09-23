const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageSchema = new Schema({
    image: {
        type: String,
        default: ''
    },
    postStatus: {
        type: String,
        default: ''
    },
    text: {
        type: String,
        default: ''
    },
    userName: {
        type: String,
        default: ''
    },
    userId: {
        type: String,
        required: true
    }
});


mongoose.model('Image', imageSchema);