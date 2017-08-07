/**
 * Env Setting
 * */
const dotenv = require('dotenv');
// FIXME: .env.productionは本番環境ごとにリモートサーバー上で用意する。git管理しない
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config();
}
const { NODE_ENV, PORT, DOMAIN, MONGODB_URI, MAIL_ADDRESS, SEED } = process.env;


/**
 * Database Setting
 * */
const mongoose = require('mongoose');
const seed = require('./etc/seed');

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI, { db: { safe: true } });
mongoose.connection.on('error', () => console.log('mongo error'));
if (SEED === 'true') seed();


/**
 * START Express setting
 * */
const express = require('express');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const path = require('path');
const Http = require('http');
const routes = require('./routes');

const root = path.join(process.cwd(), 'src');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(root, 'views'));

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());

app.use(favicon(path.join(root, 'favicon.ico')));
app.use(express.static(path.join(root, 'public')));

if (NODE_ENV === 'production') {
  app.use(express.static(path.join(root, '../build')));
  app.use(morgan('combined'));
} else {
  app.use(express.static(root));
  app.use(express.static('.tmp'));
  app.use(morgan('dev'));
}
routes(app);

/**
 * Launch Server
 */
const server = Http.createServer(app);
server.listen(PORT);
server.on('listening', () => {
  console.log(`Express server listening on ${PORT}, in ${NODE_ENV} mode`);
  console.log(`Domain is ${DOMAIN}`);
  console.log(`mailaddress->${MAIL_ADDRESS}\n`);
});
