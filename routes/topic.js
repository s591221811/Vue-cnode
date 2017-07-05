// 加载express模块
var express = require('express');
var router = express.Router();
// 加载验证用户是否登陆的中间件
var checkUser = require('../middlewares/checkUser');
// 加载控制器模块
var topicCtrol = require('../controllers/topicController');



// 定义创建路由的话题
router.get('/create',checkUser,topicCtrol.create);

// 定义处理提交数据的路由 
router.post('/create',topicCtrol.doCreate);

// 定义路由进行回复话题的处理
router.post('/reply/:_id',topicCtrol.reply);

// 定义进行点赞操作的路由
router.get('/clickGd',topicCtrol.clickGd);

// 定义收藏
router.get('/sC',topicCtrol.sC)
// 定义取消收藏
router.get('/nsC',topicCtrol.nsC)
// 定义编辑页面的路由
router.get('/edit/:_id',topicCtrol.edit);
// 定义更改操作
router.post('/doEdit/:_id',topicCtrol.doEdit);
// 定义删除话题操作
router.get('/delete/:_id',topicCtrol.delete);
// 定义路由跳转到话题详情页
router.get('/:_id',topicCtrol.show);

// 将router向外暴露
module.exports = router;