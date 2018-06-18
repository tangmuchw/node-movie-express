'use strict'

var mongoose = require('mongoose');
var scheduleData = require('../../initData/scheduleData');
var filmData = require('../../initData/filmData');

var ScreenModel = require('../screen/ScreenModel');
var FilmModel = require('../film/FilmModel');

const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
    scheduleId: String,
    filmId: String,
    screenId: String,
    _film: {
        type: Schema.ObjectId,
        ref: 'film'
    },
    _screen: {
        type: Schema.ObjectId,
        ref: 'screen'
    },
    startTime: String,
    endTime: String,
})

ScheduleSchema.index({
    scheduleId: 1
});

const ScheduleModel = mongoose.model('schedule', ScheduleSchema);

var filmId = '0622001';
var screenId = '120105'
FilmModel.findOne({
    filmId: filmId
}, function (err, docs) {
    // console.log('schedule',docs)
    if (docs) {
        var _filmIdx = docs._id
        ScreenModel.findOne({
            screenId: screenId
        }, function (err, data) {
            var _screenIdx = data._id
            ScheduleModel.findOne((err, docs) => {
                if (!docs) {
                    scheduleData.forEach(item => {
                        item._film = _filmIdx
                        item._screen = _screenIdx
                        ScheduleModel.create(item);
                    });
                }
            });

        });
    }
});

module.exports = ScheduleModel