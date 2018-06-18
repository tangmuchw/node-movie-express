'use strict';

var ScheduleModel = require('../../models/schedule/ScheduleModel')
var statusCode = require('../../config/statusCode')

/**
 *
 *getDateList
 * @param {*} req => filmId,screenId 
 * @param {*} return item Array { planCount: '0622001001', showDate: "2018-06-01"}
 * @param {*} next
 */
function getDateList(req, res, next) {
    try {
        var data = req.body;
        var filmIdReq = data.filmId
        var screenIdReq = data.screenId
        ScheduleModel.find({
            filmId:filmIdReq
        }, (err ,docs) => {
            if(err){
                res.send({
                    status: statusCode.STATUS_ERROR,
                    message: 'ERROR',
                });
            }else{
                if(docs.length != 0){
                    ScheduleModel.aggregate([{
                        '$group': {
                            '_id': {
                                filmId: "$filmId",
                                // screenId: "$screenId",
                                startTime: '$startTime'
                            },
                            scheduleId: {
                                '$push': '$scheduleId'
                            },
                            startTime: {
                                '$push': '$startTime'
                            },
                            filmId: {
                                '$push': '$filmId'
                            },
                            screenId: {
                                '$push': '$screenId'
                            },
                        }
                    }]).exec(function (err, docs) {
                        if (err) {
                            res.send({
                                status: statusCode.STATUS_ERROR,
                                message: 'ERROR',
                            });
                        } else {
                            var filterArr = [];
                            // console.lyog(docs)
                            docs.forEach(item => {
                                filterArr.push({
                                    planCount: item.scheduleId[0],
                                    showDate: item.startTime[0],
                                    filmId: item.filmId[0],
                                    screenId: item.screenId[0],
                                })
                            });
                            var compare = function (obj1, obj2) {
                                var val1 = Date.parse(new Date(obj1.showDate)) / 1000;
                                var val2 = Date.parse(new Date(obj2.showDate)) / 1000;
                                if (val1 < val2) {
                                    return -1;
                                } else if (val1 > val2) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            }
                            // var newFilterArr = filterArr.sort(compare).filter((item) =>{
                            //     return item.filmId === filmIdReq && item.screenId === screenIdReq;
                            // })
                            let length = filterArr.length
                            var sortArr = filterArr.sort(compare) 
            
                            for (let i = 0; i < sortArr.length - 1; i++) {
                                for (let j = 1; j < sortArr.length; j++) {
                                    if (i != j) {
                                        let first = String(sortArr[i].showDate)
                                        let second = String(sortArr[j].showDate)
                                        if (first.slice(0,10) == second.slice(0,10)) {
                                            sortArr.splice(j, 1)
                                        }
                                    }
                                }
                            }
                            res.send({
                                status: statusCode.STATUS_SUCCESS,
                                data: sortArr,
                                message: 'SUCCESS',
                            });
                        }
            
                    })
                }else{
                    res.send({
                        status: statusCode.STATUS_SUCCESS,
                        data:[],
                        message: 'STATUS_SUCCESS',
                    });
                }
            }
        })
      

    } catch (err) {
        res.send({
            status: statusCode.STATUS_ERROR,
            message: err,
        })
    }
}

/**
 *
 *getTimeList
 * @param {*} req => scheduleId showDate filmId
 * @param {*} return Array json {
  scheduleId: '0622001001',
  filmId: '0622001',
  filmName: '复仇者联盟3：无限战争',
  filmType: '动作动作动作动作动作动作',
  showDate: "2018-06-11",
  startTime: '2018-06-11 10:05',
  endTime: '2018-06-11 12:35',
  screenId: '120105',
  screenName: '5号厅',
  price: '34'
}5b1acc92d4bea01cc47eec27
5b1acc92d4bea01cc47eec26
 * @param {*} next
 */
function getTimeList(req, res, next) {
    try {
        var data = req.body;
        var scheduleId = data.scheduleId
        var filmId = data.filmId
        var showDate = data.showDate.substr(0,10)
        console.log(showDate)
        ScheduleModel.find({
            startTime: {
                 '$regex': showDate
            },
            filmId:filmId
        }).populate({
            path: '_film',
            select: 'filmId _id filmName price filmType'
        }).populate({
            path: '_screen',
            select: 'screenId _id screenName'
        }).exec(function (err, catetories) {
            if (err) {
                console.log(err);
            } else {
                console.log(catetories)
                if(catetories.length != 0){
                    var formatArr = []
                    catetories.forEach((item) => {
                        var json = {}
                        var film = item._film
                        var screen = item._screen
                        // console.log(film)
                        json.scheduleId = item.scheduleId
                        json.filmId = item.filmId
                        json.filmName = film.filmName
                        json.filmType = film.filmType
                        json.price = film.price
                        json.startTime = item.startTime
                        json.endTime = item.endTime
                        json.screenId = item.screenId
                        json.screenMongoId = screen._id
                        json.screenName = screen.screenName
                        formatArr.push(json)
                    })
                    res.send({
                        status: statusCode.STATUS_SUCCESS,
                        data: formatArr,
                        message: 'SUCCESS'
                    })
                }else{
                    res.send({
                        status: statusCode.STATUS_SUCCESS,
                        data: [],
                        message: 'SUCCESS'
                    })
                }
               
            }
        })
        // ScheduleModel.find({
        //     scheduleId: scheduleId
        // }).populate({
        //     path: '_film',
        //     select: 'filmId _id filmName price filmType'
        // }).populate({
        //     path: '_screen',
        //     select: 'screenId _id screenName'
        // }).exec(function (err, catetories) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         // console.log(catetories)
        //         var formatArr = []
        //         catetories.forEach((item) => {
        //             var json = {}
        //             var film = item._film
        //             var screen = item._screen
        //             // console.log(film)
        //             json.scheduleId = item.scheduleId
        //             json.filmId = item.filmId
        //             json.filmName = film.filmName
        //             json.filmType = film.filmType
        //             json.price = film.price
        //             json.startTime = item.startTime
        //             json.endTime = item.endTime
        //             json.screenId = item.screenId
        //             json.screenMongoId = screen._id
        //             json.screenName = screen.screenName
        //             formatArr.push(json)
        //         })

        //         res.send({
        //             status: statusCode.STATUS_SUCCESS,
        //             data: formatArr,
        //             message: 'SUCCESS'
        //         })
        //     }
        // })
    } catch (err) {
        res.send({
            status: statusCode.STATUS_ERROR,
            message: err,
        })
    }
}

module.exports = {
    getDateList: getDateList,
    getTimeList: getTimeList
}