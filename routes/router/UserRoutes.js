'use strict';

var express = require('express');
var UserController = require('../../controller/user/UserController');

const router = express.Router();

router.post('/login', function (req, res, next) {
    UserController.login(req, res, next)
});

router.post('/register', function (req, res, next) {
    UserController.register(req, res, next)
});


module.exports =  router;