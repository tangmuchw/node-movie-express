'use strict';

var express = require('express');
var OrderController = require('../../controller/order/OrderController');

const router = express.Router();

router.post('/createOrder', function (req, res, next) {
    OrderController.createOrder(req, res, next)
});


router.post('/cancelOrder', function (req, res, next) {
    OrderController.cancelOrder(req, res, next)
});

router.post('/getOrderDetail', function (req, res, next) {
    OrderController.getOrderDetail(req, res, next)
});

router.post('/payOrder', function (req, res, next) {
    OrderController.payOrder(req, res, next)
});

router.post('/getUserOrderList', function (req, res, next) {
    OrderController.getUserOrderList(req, res, next)
});

module.exports =  router;