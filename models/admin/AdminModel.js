'use strict'

var mongoose = require('mongoose');
var initData = require('../../initData/adminData');
var mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

// 初始化数据
const AdminSchema = new Schema({
    adminId: String,
    password:String,
    cinemaId:String,
    nickName:String,
    power:String
})
AdminSchema.plugin(mongoosePaginate);

AdminSchema.index({
    adminId: 1
});

const AdminModel = mongoose.model('admin', AdminSchema);

AdminModel.findOne((err, data) => {
	if (!data) {
		initData.forEach(item => {
			AdminModel.create(item);
		})
	}
})


module.exports = AdminModel