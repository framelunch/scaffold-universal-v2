const error = require('../helpers/error');
const user = require('../api/user');
const auth = require('../auth');

const { NODE_ENV } = process.env;
const appServer = NODE_ENV === 'production' ? require('./static') : require('./webpack');

module.exports = app => {
  /**
   * proxy setting
   */
  app.route('/api/proxy').get((req, res) => {

  });

  app.use('/api/users', user);
  app.use('/auth', auth);

  // All undefined asset or api routes should return a 404
  // TODO: JS, CSSファイルがない場合も404にしたいが、HMRの場合、webpackがファイルを提供しているので、ここで404判定できない
  app.route(['/:url(api|auth|assets)/*', '/*.(txt|xml)']).all(error[404]);

  /*
  app.route('/console*')
    .get((req, res) => {
      res.sendFile(`${app.get('appPath')}/.console.html`, { dotfiles: 'allow' });
    });
  */

  app.route('/*')
    .get(appServer)
    .all(error[404]);

  app.use((err, req, res, next) => {
    if (err) {
      error[505](err, req, res);
      next(err);
    }
  });
};
