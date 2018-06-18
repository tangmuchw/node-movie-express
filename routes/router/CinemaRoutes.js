'use strict';

var express = require('express');
var CinemaController = require('../../controller/cinema/CinemaController');

const router = express.Router();

router.post('/getCinemaList', function (req, res, next) {
    CinemaController.getCinemaList(req, res, next)
});

router.post('/deleteCinemaRecord', function (req, res, next) {
    CinemaController.deleteCinemaRecord(req, res, next)
});

router.post('/creatCinemaRecord', function (req, res, next) {
    CinemaController.creatCinemaRecord(req, res, next)
});

router.post('/updateCinemaRecord', function (req, res, next) {
    CinemaController.updateCinemaRecord(req, res, next)
});

router.post('/getCinemaDetail', function (req, res, next) {
    CinemaController.getCinemaDetail(req, res, next)
});


module.exports = router;