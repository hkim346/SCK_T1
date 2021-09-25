const mongoose = require('mongoose');

const action = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    
    pointvalue:{
        type: Number
    },

    repeat: {
        type: Number
    },

    totalPoint:{
        type: Number
    },

    userid: {
        type: String
    },

    imgurl: {
        type: String,
        required: true
    },

    date: {
        type: Date
    }
});
module.exports = mongoose.model('action',action);