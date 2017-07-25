const express = require('express');
const passport = require('passport');
const { signToken } = require('../auth.service');

const router = express.Router();

router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (info) {
      res.statusMessage = info.message;
      return res.sendStatus(401);
    }
    const token = signToken(user._id, user.role);
    return res.json({ token });
  })(req, res, next);
});

router.get('/:token', (req, res) => {
  res.render('token.ejs', { token: req.params.token, type: req.query.type });
});

module.exports = router;
