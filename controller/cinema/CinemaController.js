'use strict';

var CinemaModel = require('../../models/cinema/CinemaModel')
var statusCode = require('../../config/statusCode')
// var CircularJSON = require('circular-json');

function getCinemaList(req, res, next) {
    try {
        var data = req.body;
        var currentPage = parseInt(data.currentPage);
        var pageSize = parseInt(data.pageSize);
        var filterKey = data.queryCondition;
        var conditions;
        if (filterKey == '') {
            conditions = {};
        } else {
            const reg = new RegExp(filterKey, 'i');
            conditions = {
                '$or': [
                     {cinemaName: {$regex : reg}}
                ]
            };
        }
        // console.log(conditions)
        CinemaModel.paginate(conditions, {
            page: currentPage,
            limit: pageSize
        }, function (err, result) {
            if (err) {
                console.log("err :" + err);
            } else {
                // console.log(result)
                var response = {
                    status: statusCode.STATUS_SUCCESS,
                    data: {
                        list: result.docs,
                        totlePages: result.total,
                        currentPage: result.page,
                        pageSize: result.limit
                    },
                    message: 'QUERY_SUCCES'
                };
                res.send(JSON.stringify(response))
            }
        })
    } catch (err) {
        // console.log(err)
        res.send({
            status: statusCode.STATUS_ERROR,
            message: err,
        })
    }
}

function creatCinemaRecord(req, res, next) {
    try {
        // console.log('req ==>', req);
        const data = req.body;
        CinemaModel.count({}, function (err, total) {
            if (err) {
                console.log("err :" + err);
            } else {
                // console.log('total -->',typeof total)
                var baseCinemaIdPre = '12';
                var cinemaId = '';

                if (total < 10) {
                    cinemaId = baseCinemaIdPre + '000' + total;
                } else if (total < 100 && total >= 10) {
                    cinemaId += baseCinemaIdPre + '00' + total;
                } else {
                    cinemaId += baseCinemaIdPre + '0' + total;
                }
                // console.log('cinemaId ==>',cinemaId)
                var cinemaRecord = {};
                cinemaRecord.cinemaName = data.cinemaName;
                cinemaRecord.address = data.address;
                cinemaRecord.servicePhone = data.servicePhone;
                cinemaRecord.cinemaBrief = data.cinemaBrief;
                cinemaRecord.cinemaId = cinemaId;
                CinemaModel.create(cinemaRecord, function (err, docs) {
                    if (err) {
                        console.log("error :" + error);
                    } else {
                        // console.log('create -->', docs)
                        var response = {
                            status: statusCode.STATUS_SUCCESS,
                            data: {
                                name: docs.cinemaName
                            },
                            message: 'CREATE_SUCCES'
                        };
                        res.send(JSON.stringify(response))
                    }
                })
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
 *
 *updateCinemaRecord
 * @param {*} req => cinemaId
 * @param {*} res {status: Number,data:Array,message:String}
 * @param {*} next
 */
function updateCinemaRecord(req, res, next) {
    try {
        // console.log('req ==>', req);
        const data = req.body;
        var conditions = {
            cinemaId: data.cinemaId
        };
        var update = {
            '$set': {
                cinemaName: data.cinemaName,
                addres: data.address,
                servicePhone: data.servicePhone,
                cinemaBrief: data.cinemaBrief
            }
        };
        console.log(update)
        CinemaModel.update(conditions, update, function (error) {
            if (error) {
                res.send({
                    status: statusCode.STATUS_ERROR,
                    message: 'UPDATE_ERROR',
                });
            } else {
                console.log('Update success!');
                res.send({
                    status: statusCode.STATUS_SUCCESS,
                    message: 'UPDATE_SUCCESS',
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

function deleteCinemaRecord(req, res, next) {
    try {
        // console.log('req ==>', req);
        const data = req.body;
        var conditions = {
            cinemaId: data.cinemaId
        };

        CinemaModel.remove(conditions, function (err) {
            if (err) {
                res.send({
                    status: statusCode.STATUS_ERROR,
                    message: 'DELETE_SUCCESS',
                });
            } else {
                // console.log('DElETE success!');
                res.send({
                    status: statusCode.STATUS_SUCCESS,
                    message: 'DELETE_SUCCESS',
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
 * 
 * @param cinemaId 
 */
function getCinemaDetail(req, res, next) {
    try {
        // console.log('req ==>', req);
        const data = req.body;
        var conditions = {
            cinemaId: data.cinemaId
        };

        CinemaModel.findOne(conditions, function (err, docs) {
            if (err) {
                res.send({
                    status: statusCode.STATUS_ERROR,
                    message: 'ERROR',
                });
            } else {
                console.log(docs);
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
    getCinemaList: getCinemaList,
    creatCinemaRecord: creatCinemaRecord,
    updateCinemaRecord: updateCinemaRecord,
    deleteCinemaRecord: deleteCinemaRecord,
    getCinemaDetail:getCinemaDetail
}