'use strict';

var AdminModel = require('../../models/admin/AdminModel')
var statusCode = require('../../config/statusCode')

function getAdminList(req, res, next) {
    try {
        var data = req.body;
        var currentPage = parseInt(data.currentPage);
        var pageSize = parseInt(data.pageSize);
        var filterKey = data.queryCondition;
        var conditions;
        if (filterKey == '') {
            conditions = {};
        } else {
            const regNickName = new RegExp(filterKey, 'i');
            const regAdminId = new RegExp('^((?!' + adminId + ').)*$');

            conditions = {
                '$or': [{
                    nickName: {
                        $regex: regNickName
                    }
                }]
            };
        }
        console.log(conditions)
        AdminModel.paginate(conditions, {
            page: currentPage,
            limit: pageSize
        }, function (err, result) {
            if (err) {
                console.log("err :" + err);
                console.log()
            } else {
                console.log(result)
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
        console.log(err)
        res.send({
            status: statusCode.STATUS_ERROR,
            message: err,
        })
    }
}

function creatAdminRecord(req, res, next) {
    try {
        // console.log('req ==>', req);
        const data = req.body;
        var AdminRecord = {};
        AdminRecord.nickName = data.nickName;
        AdminRecord.AdminId = data.AdminId;
        AdminRecord.password = data.password;
        // var encrypt  =  md5(password);
        AdminRecord.power = data.power;
        AdminModel.create(AdminRecord, function (err, docs) {
            if (err) {
                console.log("error :" + error);
            } else {
                // console.log('create -->', docs)
                var response = {
                    status: statusCode.STATUS_SUCCESS,
                    data: {
                        name: docs.nickName
                    },
                    message: 'CREATE_SUCCES'
                };
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

function updateAdminRecord(req, res, next) {
    try {
        // console.log('req ==>', req);
        const data = req.body;
        var conditions = {
            AdminId: data.AdminId
        };
        var update = {
            '$set': {
                nickName: data.nickName,
                password: data.password,
                power: data.power,
            }
        };
        AdminModel.update(conditions, update, function (error) {
            if (error) {
                res.send({
                    status: statusCode.STATUS_ERROR,
                    message: 'UPDATE_SUCCESS',
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

function deleteAdminRecord(req, res, next) {
    try {
        // console.log('req ==>', req);
        const data = req.body;
        var conditions = {
            AdminId: data.AdminId
        };

        AdminModel.remove(conditions, function (err, docs) {
            if (err) {
                res.send({
                    status: statusCode.STATUS_ERROR,
                    message: 'DELETE_SUCCESS',
                });
            } else {
                console.log('DElETE success!');
                res.send({
                    status: statusCode.STATUS_SUCCESS,
                    data: {
                        name: docs.AdminName
                    },
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


function adminLogin(req, res, next) {
    try {
        var data = req.body;
        var adminId = data.adminId;
        var password = data.password;
        // var encrypt  =  md5(password)
        AdminModel.find({
            adminId: adminId,
            password: password
        }, function (err, docs) {
            if (err) {
                console.log(err)
            } else {
                if (docs.length != 0) {
                    var powerCode;
                    var powerName = docs[0].power
                    switch (powerName) {
                        case '影院管理员':
                            powerCode = 0;
                            break;
                        case '系统管理员':
                            powerCode = 1;
                            break;
                    }
                    var response = {
                        name: docs[0].nickName,
                        power: powerCode,
                        cinemaId: docs[0].cinemaId
                    }
                    res.send({
                        status: statusCode.STATUS_SUCCESS,
                        data: response,
                        message: 'LOGIN_SUCCESS'
                    })
                } else {
                    res.send({
                        status: statusCode.STATUS_ERROR,
                        message: '用户名或者密码错误！'
                    })
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
    getAdminList: getAdminList,
    creatAdminRecord: creatAdminRecord,
    updateAdminRecord: updateAdminRecord,
    deleteAdminRecord: deleteAdminRecord,
    adminLogin: adminLogin
}