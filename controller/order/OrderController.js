'use strict';

var OrderModel = require('../../models/order/OrderModel')
var SeatsModel = require('../../models/seats/SeatsModel')
var statusCode = require('../../config/statusCode')

/**
 *创建订单
 *
 * @param {*} req => filmId,screenId, accountId, 
 * filmMongoId ,screenMongoId ,accountMongoId ,price ,seatsIds(String)
 * @param {*} res json =>
 *  {
  filmName:'完美陌生人',
  count:'2',
  filmType:'动作',
  playTime:'2018-06-22 10:40',
  screenName:'5号厅',
  seatInfo:'1排1座/2排3座',
  subTotalPrice:'22',
  serviceCharge:'1',
  totalPrice:'22'
}
 * @param {*} next
 */
function createOrder(req, res, next) {
    try {
        var data = req.body
        var filmId = data.filmId
        var screenId = data.screenId
        var accountId = data.accountId
        var filmMongoId = data.filmMongoId
        var screenMongoId = data.screenMongoId
        var accountMongoId = data.accountMongoId
        var seatsIdArr = data.seatsIds.split(',')
        var price = data.price
        var orderCode = ''
        var count = '0' + seatsIdArr.length
        var accountTag = accountId.substr(7, 4)
        var timestamp = Date.parse(new Date())
        orderCode = timestamp + filmId + count + accountTag
        console.log(orderCode, seatsIdArr.length)
        var creatOrderJson = {}
        creatOrderJson.orderCode = orderCode
        creatOrderJson.filmId = filmId
        creatOrderJson.screenId = screenId
        creatOrderJson.accountId = accountId
        creatOrderJson._film = filmMongoId
        creatOrderJson._screen = screenMongoId
        creatOrderJson._user = accountMongoId
        creatOrderJson.seatsId = seatsIdArr
        var length = seatsIdArr.length
        var subTotalPrice = price * length
        var serviceCharge = 1
        creatOrderJson.subTotalPrice = subTotalPrice
        creatOrderJson.serviceCharge = serviceCharge
        creatOrderJson.totalPrice = subTotalPrice + serviceCharge
        creatOrderJson.payState = '未支付'
        console.log(creatOrderJson)
        OrderModel.create(creatOrderJson, function (err, docs) {
            if (err) {
                console.log("error :" + error);
            } else {
                // console.log('create -->', docs)
                // seatState: 0 =>available,1 => selected, 2=>booked
                seatsIdArr.forEach(item => {
                    var seatId = item
                    var conditions = {
                        seatId: seatId
                    }
                    var update = {
                        '$set': {
                            seatState: '2'
                        }
                    }
                    SeatsModel.update(conditions, update, (err, docs) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('seat update ==>', docs)
                        }
                    })
                })
                var response = {
                    status: statusCode.STATUS_SUCCESS,
                    data: {
                        orderCode: docs.orderCode
                    },
                    message: 'CREATE_SUCCES'
                }
                res.send(JSON.stringify(response))
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
 *取消订单
 *
 * @param {*} req => orderCode
 * @param {*} res json =>
 * 
 * @param {*} next
 */
function cancelOrder(req, res, next) {
    try {
        var data = req.body
        var orderCode = data.orderCode

        OrderModel.findOne({
            orderCode: orderCode
        }, (err, docs) => {
            if (err) {
                res.send({
                    status: statusCode.STATUS_ERROR,
                    message: 'DELETE_SUCCESS',
                });
            } else {
                var seatsIdArr = docs.seatsId
                console.log(seatsIdArr)
                var length = seatsIdArr.length
                var index = 0
                seatsIdArr.forEach(item => {
                    index += 1
                    var seatId = item
                    var conditions = {
                        seatId: seatId
                    }
                    var update = {
                        '$set': {
                            seatState: '0'
                        }
                    }
                    SeatsModel.update(conditions, update, (err, docs) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('seat update ==>', docs)
                            if (index == length) {
                                OrderModel.remove({
                                    orderCode: orderCode
                                }, function (err) {
                                    if (err) {
                                        res.send({
                                            status: statusCode.STATUS_ERROR,
                                            message: 'DELETE_SUCCESS',
                                        });
                                    } else {
                                        // console.log('DElETE success!');
                                        res.send({
                                            status: statusCode.STATUS_SUCCESS,
                                            message: 'CANCEL_SUCCESS',
                                        });

                                    }
                                });
                            }

                        }
                    })

                })
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
 *得到订单信息
 *
 * @param {*} req =>orderCode
 * @param {*} res jspn =>
 * filmName:'完美陌生人',
  count:'2',
  filmType:'动作',
  playTime:'2018-06-22 10:40',
  screenName:'5号厅',
  seatInfo:'1排1座/2排3座',
  subTotalPrice:'22',
  serviceCharge:'1',
  totalPrice:'22'
 * @param {*} next
 */
function getOrderDetail(req, res, next) {
    try {
        var data = req.body;
        var orderCode = data.orderCode

        OrderModel.findOne({
            orderCode: orderCode
        }).populate({
            path: '_film',
            select: 'filmId _id filmName price filmType'
        }).populate({
            path: '_screen',
            select: 'screenId _id screenName'
        }).exec(function (err, docs) {
            if (err) {
                console.log(err);
            } else {
                // console.log(catetories)
                var json = {}
                var film = docs._film
                var screen = docs._screen
                json.filmId = docs.filmId
                json.filmName = film.filmName
                json.filmType = film.filmType
                json.subTotalPrice = docs.subTotalPrice
                json.totalPrice = docs.totalPrice
                json.serviceCharge = docs.serviceCharge
                json.screenId = docs.screenId
                json.payState = docs.payState
                json.screenName = screen.screenName
                json.count = docs.seatsId.length
                var seatsIdArr = docs.seatsId
                var seatInfoArr = []
                seatsIdArr.forEach(item => {
                    var rowNum = item.substr(4, 1)
                    var columnNum = item.substr(5, 1)
                    var row, column;
                    var seatInfoItem
                    row = parseInt(rowNum) + 1
                    column = parseInt(columnNum) == 0 ? 10 : parseInt(columnNum)
                    seatInfoItem = row + '排' + column + '座'
                    seatInfoArr.push(seatInfoItem)
                })
                json.seatInfo = seatInfoArr.join('/')

                res.send({
                    status: statusCode.STATUS_SUCCESS,
                    data: json,
                    message: 'SUCCESS'
                })
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
 *支付订单
 *
 * @param {*} req => orderCode ,payState
 * @param {*} res
 * @param {*} next
 */
function payOrder(req, res, next) {
    try {
        var data = req.body;
        var orderCode = data.orderCode
        var payState = '已完成'
        var conditions = {
            orderCode: orderCode
        };
        var update = {
            '$set': {
                payState: payState
            }
        };
        console.log(update, conditions)
        OrderModel.update(conditions, update, function (error, docs) {
            if (error) {
                res.send({
                    status: statusCode.STATUS_ERROR,
                    message: 'PAYERROR',
                });
            } else {
                console.log(docs);
                OrderModel.findOne(conditions, (err, docs) => {
                    console.log(docs)
                    res.send({
                        status: statusCode.STATUS_SUCCESS,
                        data: docs,
                        message: 'PAY_SUCCESS',
                    });
                })

                return
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
 *getUserOrderList
 *
 * @param {*} req => accountId
 * @param {*} res  Array json =>
 * orderCode:'15271877120622001017526',
  cinemaName:'CGV影城(黄河道店)',
  orderCreateTime:'2018-06-02',
  getOrderPrice:'22',
  payState:'已完成',
  filmName:'完美陌生人',
  count:'2',
  filmType:'动作',
  playTime:'2018-06-22 10:40',
  screenName:'5号厅',
  seatInfo:'1排1座/2排3座',
  serviceCharge:'1',
  totalPrice:'22'
 * @param {*} next
 */
function getUserOrderList(req, res, next) {
    try {
        var data = req.body;
        var accountId = data.accountId

        OrderModel.find({
            accountId: accountId
        }).populate({
            path: '_film',
            select: 'filmId _id filmName price filmType'
        }).populate({
            path: '_screen',
            select: 'screenId _id screenName'
        }).sort({
            orderCode: 1
        }).exec(function (err, catetories) {
            if (err) {
                console.log(err);
            } else {
                // console.log(catetories)
                var formatArr = []
                catetories.forEach((docs) => {
                    var json = {}
                    var film = docs._film
                    var screen = docs._screen
                    json.filmId = docs.filmId
                    json.orderCode = docs.orderCode
                    json.payState = docs.payState
                    json.filmName = film.filmName
                    json.filmType = film.filmType
                    json.subTotalPrice = docs.subTotalPrice
                    json.totalPrice = docs.totalPrice
                    json.serviceCharge = docs.serviceCharge
                    json.screenId = docs.screenId
                    json.screenName = screen.screenName
                    var seatsIdArr = docs.seatsId
                    var seatInfoArr = []
                    json.count = seatsIdArr.length
                    seatsIdArr.forEach(item => {
                        var rowNum = item.substr(4, 1)
                        var columnNum = item.substr(5, 1)
                        var row, column;
                        var seatInfoItem
                        row = parseInt(rowNum) + 1
                        column = parseInt(columnNum) == 0 ? 10 : parseInt(columnNum)
                        seatInfoItem = row + '排' + column + '座'
                        seatInfoArr.push(seatInfoItem)
                    })
                    json.seatInfo = seatInfoArr.join('/')
                    formatArr.push(json)

                })
                res.send({
                    status: statusCode.STATUS_SUCCESS,
                    data: formatArr,
                    message: 'SUCCESS'
                })
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
    createOrder: createOrder,
    cancelOrder: cancelOrder,
    getOrderDetail: getOrderDetail,
    payOrder: payOrder,
    getUserOrderList: getUserOrderList
}