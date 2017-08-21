const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const compose = require('composable-middleware');
const User = require('../models/User');
const { USER_ROLES } = require('../etc/define');

const { TOKEN_SECRET, TOKEN_EXPIRE, COOKIE_LOGIN_TOKEN } = process.env;
const validateJwt = expressJwt({ secret: TOKEN_SECRET });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
exports.verify = () => (
  compose()
    .use((req, res, next) => {
      // allow access_token to be passed through query parameter as well
      if (req.query && Object.prototype.hasOwnProperty.call(req.query, 'access_token')) {
        req.headers.authorization = `Bearer ${req.query.access_token}`;
      }
      validateJwt(req, res, next);
    })
    .use((err, req, res, next) => {
      if (err) return res.status(401).send(err.name);
      return next(req, res, next);
    })
);
exports.isAuthenticated = () => (
  compose()
    .use(exports.verify())
    .use((req, res, next) => {
      User.findById(req.user._id, '-salt -hashedPassword -emailActivate', (err, user) => {
        if (err) return next(err);
        if (!user) return res.sendStatus(401);

        req.user = user;
        return next();
      });
    })
);

/**
 * Checks if the user role meets the minimum requirements of the route
 */
exports.hasRole = roleRequired => {
  if (!roleRequired) throw new Error('Required role needs to be set');
  return compose()
    .use(exports.isAuthenticated())
    .use((req, res, next) => {
      if (USER_ROLES.indexOf(req.user.role) >= USER_ROLES.indexOf(roleRequired)) {
        next();
      } else {
        res.sendStatus(403);
      }
    });
};

/**
 * For activation, to change email
 */
exports.sign = (obj, expire) => (
  jwt.sign(
    obj,
    TOKEN_SECRET,
    { expiresIn: expire || parseInt(TOKEN_EXPIRE, 10) },
  )
);

/**
 * Returns a jwt token signed by the app secret
 */
exports.signToken = (id, role) => (
  /**
   * Tokenに有効期限を持たせないようにしている
   */
  jwt.sign(
    { _id: id, role },
    TOKEN_SECRET,
    { expiresIn: parseInt(TOKEN_EXPIRE, 10) },
  )
);

/**
 * Set token cookie directly for oAuth strategies
 */
exports.setTokenCookie = (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: 'Something went wrong, please try again.' });
  }
  res.cookie(COOKIE_LOGIN_TOKEN, exports.signToken(req.user._id, req.user.role));
  return res.redirect('/');
};
