'use strict'

var mongoose = require('mongoose');
var screenData = require('../../initData/screenData');
var cinemaData = require('../../initData/cinemaData');
var CinemaModel = require('../cinema/CinemaModel');

const Schema = mongoose.Schema;

const ScreenSchema = new Schema({

    screenId: String,
    cinemaId: String,
    _cinema: {
        type: Schema.ObjectId,
        ref: 'cinema'
    },
    screenName: String,
    screenType: String,
    seatSum: String,
    seatsSumRows: String,
    seatsSumColumns: String

})

ScreenSchema.index({
    screenId: 1
});

const ScreenModel = mongoose.model('screen', ScreenSchema);

let cinemaId = '120001'
CinemaModel.findOne({
    cinemaId: cinemaId
}, function (err, docs) {
    if (docs) {
        var _idx = docs._id
        ScreenModel.findOne((err, docs) => {
            if (!docs) {
                screenData.forEach(item => {
                    item._cinema = _idx
                    ScreenModel.create(item);
                })
            }
        });
    }
});


module.exports = ScreenModel;