const mongoose = require('mongoose');

let c_schema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    site: String,
    imgurl: String,
    designer: String,
    title: String,
    alert: Number,  // user inputted price
    price: String,  // last scanned price
    fprice: Number,  // formatted price, typeof Number for comparison with alert
    lastupdate: Date  // last fprice update date
})

const clothingdb = mongoose.model('clothingdb', c_schema);

module.exports = clothingdb;