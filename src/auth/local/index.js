const express = require('express');
const contoller = require('./local.controller');

const router = express.Router();

router.post('/', contoller.auth);

router.get('/:token', (req, res) => {
  res.render('token.ejs', { token: req.params.token, type: req.query.type });
});

module.exports = router;
