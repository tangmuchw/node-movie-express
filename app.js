

var mongoose = require('./mongodb/mongoose');
var db = mongoose();
// require('./mongodb/db')

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var frontRouter = require('./routes/front');
var manageRouter = require('./routes/manage');
var cors = require('cors');


var app = express();

// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'test'
// });
 
// connection.connect();


//设置跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(cors({
  origin:['http://localhost:8086','http://localhost:8086'],
  methods:['GET','POST'],
  alloweHeaders:['Content-Type', 'Authorization']
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// var questions = [{
//     data: 213,
//     num: 444,
//     age: 12
//   },
//   {
//     data: 456,
//     num: 678,
//     age: 13
//   }
// ];

// //写个接口123
// app.get('/front/getCinemaList', function (req, res) {
//     res.status(200),
//     res.json(questions)
// });
//路由设置
// indexRouter(app)
// app.use('/admin',adminRouter)
app.use('/',indexRouter)
frontRouter(app)
manageRouter(app)

// indexRouter(app)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;