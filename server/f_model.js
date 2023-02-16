const mongoose = require('mongoose');

let f_schema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    ownership: {
        type: String,
        required: true
    },
    link: String,
    designer: String,
    title: String,
    rating: Number,
    imgurl: String
})

const fragdb = mongoose.model('fragdb', f_schema);

module.exports = fragdb;