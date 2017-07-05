var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// 加载session模块
var session = require('express-session');
// 加载flash模块
var flash = require('connect-flash');
var timeQ  = require('./middlewares/time');

// 加载路由模板
var index = require('./routes/index');
var user = require('./routes/user');
var topic = require('./routes/topic');
var admin = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// 静态 资源目录
app.use(express.static(path.join(__dirname, 'public')));
// 将文件上传存储目录静态托管
app.use(express.static(path.join(__dirname, 'uploads')));
// 设置session的中间件
app.use(session({
	secret:'你看看那',
  resave:true,
  saveUninitialized:true,
	rolling:true,
	cookie:{
		path:'/',
		maxAge:1000*60*10
	}
}));
// 设置flash中间件
app.use(flash());
// 挂载到全局对象res.locals上
app.use(function(req,res,next){
  // 用户信息session
	res.locals.user = req.session.user;
  // 一次性登陆错误信息
  res.locals.errInfo =req.flash('errInfo');
  // 一次性更改头像错误信息
  res.locals.errImg = req.flash('errImg');

  res.locals.timeQ = timeQ;
	next();
});
// 分配路由
app.use('/', index);
app.use('/user', user);
app.use('/topic', topic);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
