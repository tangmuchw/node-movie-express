'use strict'

var mongoose = require('mongoose');
var userData = require('../../initData/userData');
var mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    accountId:{type: String, required: true, unique: true},
    password:String,
    face:String,
    nickName:String,
    phone:String,
    sex:String,
    age:String,
    suggestion:String
})

UserSchema.plugin(mongoosePaginate);

UserSchema.index({
    accountId: 1
});

const UserModel = mongoose.model('users', UserSchema);

UserModel.findOne((err, data) => {
    if (!data) {
        userData.forEach(item => {
            UserModel.create(item);
        })
    }
})

module.exports = UserModel