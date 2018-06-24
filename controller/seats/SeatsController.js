'use strict';

var SeatsModel = require('../../models/seats/SeatsModel')
var statusCode = require('../../config/statusCode')
var ScheduleModel = require('../../models/schedule/ScheduleModel')



/**
 *
 *getSeatsMap
 * @param {*} req => screenId ，scheduleId , startTime
 * @param {*} return json Array 
 * { 
  screenId: '120105',
  screenName: '5号厅',
  seatSum: '20',
  seatsSumRows: 2,
  seats:Array
}
 * @param {*} next
 */
function getSeatsMap(req, res, next) {
    try {
        var data = req.body;
        var screenId = data.screenId
        var scheduleId = data.scheduleId
        var startTime = data.startTime
        
        // ScheduleModel.find({
        //     scheduleId:scheduleId
        // }, (err, dcos) =>{
        //     if(err){
        //         console.log(err);
        //     }else{

        //     }
        // })
        SeatsModel.find({
            screenId: screenId,
            startTime:startTime
        }).populate({
            path: '_screen',
            select: 'screenId screenName seatSum seatsSumRows seatsSumColumns'
        }).sort({
            seatId: 1
        }).exec(function (err, catetories) {
            if (err) {
                console.log(err);
            } else {
                console.log('seat ==>', catetories)
                if (catetories.length != 0) {
                    var screenData = catetories[0]._screen
                    var seatsSumRows = screenData.seatsSumRows
                    var seatsSumColumns = screenData.seatsSumColumns
                    var map = []
                    for (var i = 0; i < seatsSumRows; i++) {
                        map[i] = new Array()
                        for (var j = 0; j < seatsSumColumns; j++) {
                            var index 
                            if(i<1){
                                index = seatsSumColumns*i+j
                            }else{
                                index = seatsSumColumns*i+j
                            }
                            map[i][j] = catetories[index]
                        }
                    }
                    var json = {}
                    json.screenId = screenData.screenId
                    json.screenName = screenData.screenName
                    json.seatSum = screenData.seatSum
                    json.seatsSumRows = parseInt(screenData.seatsSumRows)
                    json.seatsSumColumns = screenData.seatsSumColumns
                    json.seats = map
                    res.send({
                        status: statusCode.STATUS_SUCCESS,
                        data: json,
                        message: 'SUCCESS',
                    });
                } else {
                    res.send({
                        status: statusCode.STATUS_SUCCESS,
                        data: [],
                        message: 'SUCCESS',
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
module.exports = {
    getSeatsMap: getSeatsMap
}