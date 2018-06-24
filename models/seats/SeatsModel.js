'use strict'

var mongoose = require('mongoose');
var seatsData = require('../../initData/seatsData');
var ScreenModel = require('../screen/ScreenModel');

const Schema = mongoose.Schema;

const SeatsSchema = new Schema({
    screenId: String,
    _screen: {
        type: Schema.ObjectId,
        ref: 'screen'
    },
    seatId: String,
    rowNum: String,
    columnsNum: String,
    seatState: String,
    startTime:String
})

SeatsSchema.index({
    seatId: 1
});

const SeatsModel = mongoose.model('seats', SeatsSchema);

var screenId = '120105'
ScreenModel.findOne({
    screenId: screenId
}, function (err, docs) {
    // console.log('screen',docs)
    if (docs) {
        var _idx = docs._id
        SeatsModel.findOne((err, docs) => {
            if (!docs) {
                seatsData.forEach(item => {
                    item._screen = _idx
                    SeatsModel.create(item);
                });
            }
        });
    }
});


module.exports = SeatsModel