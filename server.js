const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');  // built-in node module
// const cron = require('node-cron');  // attempt auto scan every 1hr (if IP blocked and couldnt finish previous scan)
const connectDB = require('./server/connection');
const app = express();

dotenv.config( { path: 'config.env'} );
const PORT = process.env.PORT || 3000

// log requests
app.use(morgan('tiny'));

// mongodb connections
connectDB();

// parse request to bodyparser
app.use(bodyparser.urlencoded({ extended: true }));

// set view engine
app.set('view engine', 'ejs');

// load assets
app.use('/css', express.static(path.resolve(__dirname, 'assets/css')));
app.use('/img', express.static(path.resolve(__dirname, 'assets/img')));
app.use('/js', express.static(path.resolve(__dirname, 'assets/js')));

// load routers
app.use('/', require('./server/router'));


app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
});

app.use((req, res) => {
    res.render('404');
});
