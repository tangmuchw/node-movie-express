'use strict';

var FilmModel = require('../../models/film/FilmModel')
var statusCode = require('../../config/statusCode')

function getFilmList(req, res, next){
    try {
        FilmModel.find({}, function (err, docs) {
            if (err) {
                res.send({
                    status: statusCode.STATUS_ERROR,
                    message: 'ERROR',
                });
            } else {
                // console.log(docs);
                res.send({
                    status: statusCode.STATUS_SUCCESS,
                    data: docs,
                    message: 'SUCCESS',
                });
            }
        });
    } catch (err) {
        res.send({
            status: statusCode.STATUS_ERROR,
            message: err,
        })
    }
}

/** 
 * @param filmId
*/
function getFilmDetail(req, res, next){
    try {
        var data = req.body;
        var filmId = data.filmId

        FilmModel.findOne({filmId:filmId}, function (err, docs) {
            if (err) {
                res.send({
                    status: statusCode.STATUS_ERROR,
                    message: 'ERROR',
                });
            } else {
                // console.log(docs);
                res.send({
                    status: statusCode.STATUS_SUCCESS,
                    data: docs,
                    message: 'SUCCESS',
                });
            }
        });
    } catch (err) {
        res.send({
            status: statusCode.STATUS_ERROR,
            message: err,
        })
    }
}



module.exports = {
    getFilmList:getFilmList,
    getFilmDetail:getFilmDetail
}