const passport = require('passport');
const { Strategy } = require('passport-local');
const User = require('../../models/User');
const { signToken } = require('../auth.service');

passport.use(new Strategy({
  usernameField: 'email',
  passwordField: 'password', // this is the virtual field on the model
}, (email, password, done) => {
  User.findOne({
    email: email.toLowerCase(),
  }, (err, user) => {
    if (err) return done(err);

    if (!user) {
      return done(null, false, { message: 'This email is not registered.' });
    }
    if (!user.emailActivate) {
      return done(null, false, { message: 'This email is not activated.' });
    }

    if (!user.authenticate(password)) {
      return done(null, false, { message: 'This password is not correct.' });
    }

    return done(null, user);
  });
}));

exports.auth = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (info) {
      res.statusMessage = info.message;
      return res.sendStatus(401);
    }
    const token = signToken(user._id, user.role);
    return res.json({ token });
  })(req, res, next);
};
