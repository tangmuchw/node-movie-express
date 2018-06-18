'use strict';

var CinemaRoutes = require('./router/CinemaRoutes');
var UserRoutes = require('./router/UserRoutes');
var AdminRoutes = require('./router/AdminRoutes');
var FilmRoutes = require('./router/FilmRoutes');
var ScreenRoutes = require('./router/ScreenRoutes');
var SeatsRouter = require('./router/SeatsRoutes');
var SheduleRoutes = require('./router/SheduleRoutes');
var OrderRoutes = require('./router/OrderRoutes');


var ServerParam = require('../config/param');
const basePath = ServerParam.basePathFront;

module.exports = function(app){
    
    app.use(basePath+'/cinema',CinemaRoutes);
    app.use(basePath+'/admin',AdminRoutes);
    app.use(basePath+'/film',FilmRoutes);
    app.use(basePath+'/order',OrderRoutes);
    app.use(basePath+'/screen',ScreenRoutes);
    app.use(basePath+'/seats',SeatsRouter);
    app.use(basePath+'/schedule',SheduleRoutes);
    app.use(basePath+'/user',UserRoutes);
};