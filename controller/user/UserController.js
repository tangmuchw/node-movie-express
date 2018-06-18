'use strict';

var UserModel = require('../../models/user/UserModel')
var statusCode = require('../../config/statusCode')
// var CircularJSON = require('circular-json');

/**
 * 用户登录
 * @param {*} req =? accountId,password
 * @param {*} res 
 * @param {*} next 
 */
function login(req, res, next) {
    try {
        var data = req.body;
        var accountId = data.accountId;
        var password = data.password;
        // var encrypt  =  md5(password)
        UserModel.find({
            accountId: accountId,
            password: password
        }, function (err, docs) {
            if (err) {
                console.log(err)
            } else {
                if (docs.length != 0) {
                    res.send({
                        status: statusCode.STATUS_SUCCESS,
                        data:docs[0],
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

/**
 * 用户注册
 * @param {*} req =? accountId,password,nickName
 * @param {*} res 
 * @param {*} next 
 */

function register(req, res, next) {
    try {
        var data = req.body;
        var accountId = data.accountId;
        var password = data.password;
        var nickName = data.nickName;
        // var encrypt  =  md5(password)
        UserModel.findOne({
            accountId: accountId
        }, (err, docs) => {
            if (err) {
                console.log(err)
            } else {
                console.log(docs)
                if (!docs) {
                    UserModel.create({
                        accountId: accountId,
                        password: password,
                        nickName: nickName
                    }, function (err, docs) {
                        if (err) {
                            console.log(err)
                        } else {
                            res.send({
                                status: statusCode.STATUS_SUCCESS,
                                data: {
                                    nickName: docs.nickName
                                },
                                message: 'REGISTER_SUCCESS'
                            })
                        }
                    })
                } else {
                    res.send({
                        status: statusCode.STATUS_SUCCESS,
                        message: '用户已存在'
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
    login: login,
    register: register
}