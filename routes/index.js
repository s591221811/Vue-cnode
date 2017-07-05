var express = require('express');
var router = express.Router();

// 加载控制器模块
var  indexControl = require('../controllers/indexController');

/* GET home page. */
router.get('/', indexControl.index);
// 定义路由 进入注册页面
router.get('/zhuce', indexControl.zhuce);
// 定义路由 /checkUname  连接数据库进行用户名校验
router.get('/checkUname',indexControl.checkUname);
// 定义路由 /checkEmail  连接数据库进行邮箱校验
router.get('/checkEmail',indexControl.checkEmail);
// 定义路由 /dozhuce  将用户的数据写入数据库 
router.post('/dozhuce',indexControl.dozhuce);

// 定义路由 进入登陆页面
router.get('/login', indexControl.login);

// 定义路由  对登陆传输数据进行处理
router.post('/dologin', indexControl.dologin);
// 定义重置密码操作
router.get('/reset_pass',indexControl.reset);
// 定义发送邮件的操作
router.post('/doreset',indexControl.doreset);
// 定义路由/emailtip 跳转到提示需要验证的页面  
router.get('/emailtip',indexControl.emailtip);

// 定义路由 /verifyEmail  进行验证成功操作
router.get('/verifyEmail',indexControl.verifyEmail);

// 定义退出的路由  /logout  进行退出操作 删除session
router.get('/logout',indexControl.logout);

module.exports = router;
