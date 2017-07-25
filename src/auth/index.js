const express = require('express');
const setupLocal = require('./local/setup');
const local = require('./local');

const router = express.Router();

// Passport Configuration
setupLocal();

router.use('/local', local);

module.exports = router;
