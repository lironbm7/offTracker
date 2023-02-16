const express = require('express');
const route = express.Router();

const services = require('../server/services/render');
const controller = require('../server/controller');

route.get('/about', services.about);

// Fragrances
// Routes
route.get('/f-index', services.homeRoutes);
route.get('/add-frag', services.add_frag);
route.get('/update-frag', services.update_frag);  

// API
route.post('/api/frags', controller.create);
route.get('/api/frags', controller.find);
route.put('/api/frags/:id', controller.update);
route.delete('/api/frags/:id', controller.delete);

// Clothing
// Routes
route.get('/', services.c_homeRoutes);
route.get('/c-index', services.c_homeRoutes);
route.get('/add-clothing', services.add_clothing);
route.get('/update-clothing', services.update_clothing);  
route.get('/scanprices', controller.c_scanprices);

// API
route.post('/api/clothings', controller.c_create);
route.get('/api/clothings', controller.c_find);
route.put('/api/clothings/:id', controller.c_update);
route.delete('/api/clothings/:id', controller.c_delete);

module.exports = route;