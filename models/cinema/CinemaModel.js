'use strict'

var mongoose = require('mongoose');
var cinemaData = require('../../initData/cinemaData');
var mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const CinemaSchema = new Schema({
    cinemaId: String,
    cinemaName: String,
    address: String,
    servicePhone: String,
    cinemaBrief: String
});

CinemaSchema.plugin(mongoosePaginate);

CinemaSchema.index({
    cinemaId: 1
});

const CinemaModel = mongoose.model('cinema', CinemaSchema);

CinemaModel.findOne((err, data) => {
	if (!data) {
		cinemaData.forEach(item => {
			CinemaModel.create(item);
		})
	}
});

module.exports = CinemaModel;