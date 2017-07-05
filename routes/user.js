var express = require('express');
var router = express.Router();
// 加载user路由的控制器
var userCtrol = require('../controllers/userController');
//加载检验用户是否登陆的中间件模块
var checkUser = require('../middlewares/checkUser') 
// 设置每一个路由都经过这个中间件
router.get('/*',checkUser);

// 定义个人中心的路由 /ucenter  
router.get('/ucenter',userCtrol.ucenter)
// 定义修改个人信息的路由 /setting
router.post('/setting',userCtrol.setting)

// 定义上传图片的路由  /imgSet   上传图片并进行缩放 
router.post('/imgSet',userCtrol.imgSet);
// 定义路由更改邮箱  /emailSet   进行发送邮件操作
router.post('/emailSet',userCtrol.emailSet);
// 定义路由验证邮箱   /verfyEmail  完成验证 进行更新 
router.get('/verfyEmail',userCtrol.verfyEmail);
// 定义验证密码   /checkPwd   
router.get('/checkPwd',userCtrol.checkPwd);
// 定义发送验证码的路由   /sendDx
router.get('/sendDx',userCtrol.sendDx);


// 定义定义进行修改密码的操作
router.post('/make',userCtrol.make);
// 定义进入关于自己的收藏
router.get('/:_id',userCtrol.user)
module.exports = router;
