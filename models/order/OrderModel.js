'use strict'

var mongoose = require('mongoose');
var orderData = require('../../initData/orderData');
var ScreenModel = require('../screen/ScreenModel');
var FilmModel = require('../film/FilmModel');
var UserModel = require('../user/UserModel');


const Schema = mongoose.Schema;

const OrderSchema = new Schema({

    orderCode: String,
    seatsId: Array,
    filmId: String,
    screenId: String,
    accountId: String,
    _film: {
        type: Schema.ObjectId,
        ref: 'film'
    },
    _screen: {
        type: Schema.ObjectId,
        ref: 'screen'
    },
    _user: {
        type: Schema.ObjectId,
        ref: 'user'
    },
    subTotalPrice: String,
    totalPrice: String,
    payState: String,
    serviceCharge: String
})

OrderSchema.index({
    orderCode: 1
});

const OrderModel = mongoose.model('order', OrderSchema);

var filmId = '0622001';
var screenId = '120105';
var accountId = '13622077526';
FilmModel.findOne({
    filmId: filmId
}, function (err, docs) {
    // console.log('order', docs)
    if (docs) {
        var _filmIdx = docs._id
        ScreenModel.findOne({
            screenId: screenId
        }, function (err, docs) {
            // console.log('order', docs)
            if (docs) {
                var _screenIdx = docs._id
                UserModel.findOne({
                    accountId: accountId
                }, function (err, docs) {
                    var _accountIdx = docs._id

                    OrderModel.findOne((err, docs) => {
                        if (!docs) {
                            orderData.forEach(item => {
                                item._film = _filmIdx
                                item._screen = _screenIdx
                                item._user = _accountIdx
                                OrderModel.create(item);
                            });
                        }
                    });
                })
            }
        });
    }
});

module.exports = OrderModel;