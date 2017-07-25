const express = require('express');
const controller = require('./user.controller');
const { isAuthenticated, hasRole, verify } = require('../../auth/auth.service');

const router = express.Router();

router.get('/', controller.getUsers);
router.post('/', controller.createUser);

router.get('/activate', isAuthenticated(), controller.activateUser);

router.get('/me', isAuthenticated(), controller.getUser);

router.get('/:id', controller.getUser);

module.exports = router;
