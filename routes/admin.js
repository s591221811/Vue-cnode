var express = require('express');
var router = express.Router();
// 检测是有权限的用户登陆
var checkAdmin = require('../middlewares/checkAdmin');
// 加载控制器模块
var  adminCtrl = require('../controllers/admincontroller');
// 定义登陆
router.get('/login',adminCtrl.login);

// 定义登陆操作
router.post('/dologin',adminCtrl.dologin);
// 定义首页
router.all('/*',checkAdmin);

router.get('/',adminCtrl.index);
// 用户列表
router.get('/user',adminCtrl.user);
// 定义用户的封号操作
router.get('/user/set',adminCtrl.set);
// 定义升级为管理员的操作
router.get('/user/setAdmin',adminCtrl.setAdmin);
// 定义显示话题详情的操作
router.get('/cate',adminCtrl.cate);
// 定义编辑话题详情的操作
router.get('/cate/edit/:_id',adminCtrl.edit);
// 更新话题分类详情操作
router.get('/cate/doEdit',adminCtrl.doEdit);
//定义删除话题分类的操作
router.get('/cate/add',adminCtrl.add);
//定义添加话题分类操作
router.get('/cate/doAdd',adminCtrl.doAdd);
//定义话题的详情
router.get('/topic',adminCtrl.topic);
// 定义加精操作
router.get('/topic/isJing/:_id',adminCtrl.isJing);
// 定义置顶操作
router.get('/topic/isTop/:_id',adminCtrl.isTop);
// 定义删除操作
router.get('/topic/delete/:_id',adminCtrl.delete);

module.exports = router;


