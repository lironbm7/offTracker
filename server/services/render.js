const axios = require('axios');
const { response } = require('express');

exports.homeRoutes = (req, res) => {
    axios.get(`${process.env.SERVERURL}/api/frags`)
        .then(function(response) {
            res.render('f-index', { frags: response.data });
        })
        .catch(err => {
            res.send(err); 
        })
}

exports.add_frag = (req, res) => {
    res.render('add_frag');
}

exports.update_frag = (req, res) => {
    axios.get(`${process.env.SERVERURL}/api/frags`, { params: { id: req.query.id }})  // specific frag from db
    .then(function(fragdata) {
        res.render('update_frag', { frag: fragdata.data });
    })
    .catch(err => {
        res.send(err);
    })
}


exports.c_homeRoutes = (req, res) => {
    axios.get(`${process.env.SERVERURL}/api/clothings`)
        .then(function(response) {
            res.render('c-index', { clothings: response.data });
        })
        .catch(err => {
            res.send(err); 
        })
}

exports.add_clothing = (req, res) => {
    res.render('add_clothing');
}

exports.update_clothing = (req, res) => {
    axios.get(`${process.env.SERVERURL}/api/clothings`, { params: { id: req.query.id }}) 
    .then(function(clothingdata) {
        res.render('update_clothing', { clothing: clothingdata.data });
    })
    .catch(err => {
        res.send(err);
    })
}

exports.about = (req, res) => {
    res.render('about');
}

// the 404 route is put directly in server.js
