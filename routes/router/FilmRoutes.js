'use strict';

var express = require('express');
var FilmController = require('../../controller/film/FilmController');

const router = express.Router();

router.get('/getFilmList',function (req, res, next) {
    FilmController.getFilmList(req, res, next)
});

router.post('/getFilmDetail',function (req, res, next) {
    FilmController.getFilmDetail(req, res, next)
});

module.exports =  router;