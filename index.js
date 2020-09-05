const express = require('express');
const path = require('path');
const router = require('./routes/auth');
require('dotenv').config();

// DB config
require('./database/config').dbConnection();


// app de express
const app = express();

// lectura y parseo del body
app.use(express.json());

// node server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');


// path publico
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));


// mis rutas
app.use('/api/login', router);



server.listen(process.env.PORT, (err) => {
    if(err) throw new Error(err);

    console.log('Servidor corriendo en puerto', process.env.PORT);
});