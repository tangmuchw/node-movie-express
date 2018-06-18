'use strict';

var module = require('../../models/screen/ScreenModel')

class ScreenController {
    constructor() {

    }

    async getData(req, res, next) {
        try {
            const list = await module.find()
            res.send({
                status: 200,
                data: list,
                message: '成功'
            })
        } catch (err) {
            res.send({
                status: 0,
                message: '失败',
            })
        }

    }
}

module.exports = new ScreenController()