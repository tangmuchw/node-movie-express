'use strict';

var express = require('express');
var SeatsController = require('../../controller/seats/SeatsController');

const router = express.Router();

router.post('/getSeatsMap',function (req, res, next) {
    SeatsController.getSeatsMap(req, res, next)
});

module.exports =  router;