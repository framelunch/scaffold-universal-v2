const express = require('express');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const path = require('path');

const { NODE_ENV } = process.env;
const root = path.join(process.cwd(), 'src');

module.exports = app => {
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
    /**
     * 開発環境ではHRMとbrowsersyncを共存させるために、CORSを許可する
     */
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');
      next();
    });

    app.use(express.static(root));
    app.use(express.static('.tmp'));
    app.use(morgan('dev'));
  }
};
