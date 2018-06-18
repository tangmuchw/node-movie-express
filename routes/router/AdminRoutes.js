'use strict';

var express = require('express');
var AdminController = require('../../controller/admin/AdminController');

const router = express.Router();

router.post('/adminLogin', function (req, res, next) {
    AdminController.adminLogin(req, res, next)
});

router.post('/getAdminList', function (req, res, next) {
    AdminController.getAdminList(req, res, next)
});

router.post('/deleteAdminRecord', function (req, res, next) {
    AdminController.deleteAdminRecord(req, res, next)
});

router.post('/creatAdminRecord', function (req, res, next) {
    AdminController.creatAdminRecord(req, res, next)
});

router.post('/updateAdminRecord', function (req, res, next) {
    AdminController.updateAdminRecord(req, res, next)
});

// router.post('/updateAdminRecord', function (req, res, next) {
//     AdminController.updateAdminRecord(req, res, next)
// });


module.exports =  router;