// 引入用户模块
var userModel = require('../model/userModel');
// 加载话题模块
var cateModel = require('../model/cateModel');
// 加载topic模块
var topicModel = require('../model/topicModel');

// 定义一个控制器
var adminCtrl = {};

// 主页
adminCtrl.index = function(req,res){
	// res.send('管理');
	res.render('admin/index');
}

// 定义登陆页面
adminCtrl.login = function(req,res){
	res.render('admin/login')
}
// 定义登陆处理
adminCtrl.dologin = function(req,res){
	res.redirect('/admin')
}

// 用户列表
adminCtrl.user = function(req,res){
	userModel.find({},{username:1,gold:1,level:1,feng:1},function(err,msg){
		res.render('admin/userTable',{data:msg});
	});
	
}
// 封号解封操作 管理员封号 等级及登陆权限全部取消
adminCtrl.set =  function(req,res){
	var con = {
		_id : req.query._id,
	}
	userModel.findOne(con,function(err,msg){
		if(msg.feng==1 ){
			var datas = {
				feng : 0,
				level : 0
			}
			userModel.update(con,datas,function(err){
				if(err){
					console.log(111)
				}
			 	res.redirect('/login');
			});
		}else {
			var datas = {	
				feng:1
			}
			userModel.update(con,datas,function(err){
				if(err){
					console.log(111);
				}
			 	res.redirect('back');
			});
		}
	});
}

// 定义升级为管理员的操作
adminCtrl.setAdmin =  function(req,res){
	var con = {
		_id : req.query._id,
	}
	userModel.findOne(con,function(err,msg){
		if(msg.level==1){
			console.log(111)
			var datas = {
				level : 0
			}
			userModel.update(con,datas,function(err){
				if(err){
					console.log(111)
				}
			 	res.redirect('/login');
			});
		}else {
			console.log(000)
			var datas = {	
				level:1
			}
			userModel.update(con,datas,function(err){
				if(err){
					console.log(111);
				}
			 	res.redirect('back');
			});
		}
	});
}

// 定义显示话题详情的操作
adminCtrl.cate = function(req,res){
	// 查询所有的话题 
	cateModel.find({},function(err,msg){
		res.render('admin/cateTable',{data:msg});
	}).sort({orderNum:1});
	
}

// 定义编辑话题信息的操作
adminCtrl.edit = function(req,res){
	// 条件
	var con = {
		_id : req.params._id
	}
	// 查询
	cateModel.findOne(con,function(err,msg){
		res.render('admin/edit',{data:msg});
	})
	
}
// 定义编辑话题信息的操作
adminCtrl.doEdit = function(req,res){
	var con ={
		_id : req.query._id
	}
	var data = {
		catename:req.query.catename
	}
	// console.log(con);
	// 更新
	cateModel.update(con,data,function(err){
		if(err){
			console.log(err);
		}
		res.redirect('/admin/cate');
	});
}
// 定义编辑话题信息的操作
adminCtrl.add = function(req,res){
	cateModel.find({},function(err,msg){
		var index = msg.length;
		var last = msg[index-1];
		res.render('admin/addCate',{data:last});
	}).sort({orderNum:1});
	
}
// 添加话题分类
adminCtrl.doAdd = function(req,res){
	// res.send('保存中');
	var datas = {
		orderNum : parseInt(req.query.orderNum),
		catename : req.query.catename
	}
	cateModel.create(datas,function(err){
		if(err){
			console.log(err);
		}
		res.redirect('/admin/cate')
	});
	
}
// 显示所有的话题
adminCtrl.topic = function(req,res){
	// res.send('保存中');
	topicModel.find({}).populate('cate',{catename:1}).populate('user',{username:1}).sort({regtime:-1}).exec(function(err,msg){
			res.render('admin/allTopic',{data:msg});
			// console.log(msg);
	});
}

// 加精操作
adminCtrl.isJing = function(req,res){
	// 条件 
	var  con = {
		_id : req.params._id
	}
	// console.log(con);
	var datas = {
		isJing : 1
	}
	topicModel.update(con,datas,function(err){
		if(err){
			console.log('加精失败')
		}
		res.redirect('back');
	});
}

// 置顶操作
adminCtrl.isTop = function(req,res){
	var  con = {
		_id : req.params._id
	}
	// console.log(con);
	var datas = {
		isTop : 1
	}
	topicModel.update(con,datas,function(err){
		if(err){
			console.log('置顶失败')
		}
		res.redirect('back');
	});
}

// 删除操作
// 置顶操作
adminCtrl.delete = function(req,res){
	var  con = {
		_id : req.params._id
	}
	
	topicModel.remove(con,function(err){
		if(err){
			console.log('删除失败')
		}
		res.redirect('back');
	});
}
// 向外暴露
 module.exports = adminCtrl;