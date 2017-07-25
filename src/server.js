const express = require('express');
const mongoose = require('mongoose');
const Http = require('http');

const seed = require('./config/seed');
const config = require('./config');
const configExpress = require('./config/express');
const configRoutes = require('./routes');

const { NODE_ENV, PORT, MAIL_ADDRESS, SEED } = process.env;
const app = express();
const server = Http.createServer(app);

// Connect to database
mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', () => console.log('mongo error'));
if (SEED === 'true') seed();

configExpress(app);
configRoutes(app);

server.listen(PORT);
server.on('listening', () => {
  console.log(`Express server listening on ${PORT}, in ${NODE_ENV} mode`);
  console.log(`mailaddress->${MAIL_ADDRESS}\n`);
});
