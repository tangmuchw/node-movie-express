'use strict';

var express = require('express');
var ScheduleController = require('../../controller/schedule/ScheduleController');

const router = express.Router();

router.post('/getDateList', function (req, res, next) {
    ScheduleController.getDateList(req, res, next)
});

router.post('/getTimeList', function (req, res, next) {
    ScheduleController.getTimeList(req, res, next)
});

module.exports =  router;