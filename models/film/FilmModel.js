'use strict'

var mongoose = require('mongoose');
var filmData = require('../../initData/filmData');

const Schema = mongoose.Schema;

const FilmSchema = new Schema({

    filmId: String,
    filmName: String,
    poster: String,
    duration: String,
    filmType: String,
    filmBreif: String,
    price: String

})

FilmSchema.index({
    filmId: 1
});

const FilmModel = mongoose.model('film', FilmSchema);

FilmModel.findOne((err, docs) => {
	if (!docs) {
		filmData.forEach(item => {
			FilmModel.create(item);
		})
	}
})


module.exports = FilmModel