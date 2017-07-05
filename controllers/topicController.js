// 加载话题分类模板模块
var cateModel = require('../model/cateModel');
// 加载话题模板模块
var topicModel = require('../model/topicModel');
// 加载用户模板 
var userModel = require('../model/userModel');
// 加载回复模板
var replyModel = require('../model/replyModel');
// 加载eventproxy模块
var eventProxy = require('eventproxy');
// 定义一个控制器
var topicCtrl = {};

// 挂载方法
// 查询数据 并分配到模板上
topicCtrl.create = function(req,res){
	// 查询所有的话题 并分配到模板
	cateModel.find(function(err,date){
		// console.log(date);
		// console.log(err);
		res.render('createTopic',{cates:date});
	}).sort({orderNum:1});
}
// 存储数据 跳转到话题页
topicCtrl.doCreate = function(req,res){
	var date = {
		cate : req.body.cate,
		user : req.session.user._id,
		topicname : req.body.title,
		content : req.body.content
	}
	// 插入数据  进行更新 发布话题要进行更新数据库的users  因为积分要进行+5
	topicModel.create(date,function(err,msg){
		if(err){
			res.redirect('back');
		}else{
			// 成功积分+5
			var con ={
				_id : req.session.user._id
			}
			userModel.update(con,{$inc:{gold:5}},function(err,data){
				// 更新完之后跳转到话题详情页
				// 重新创建session
				// 查询用户
				userModel.findOne(con,function(err,userMsg){
					req.session.user = {
						username : userMsg.username,
						_id : userMsg._id,
						email : userMsg.email,
						nickname :userMsg.nickname,
						mark  : userMsg.mark,
						level : userMsg.level,
						gold : userMsg.gold,
						userpic : userMsg.userpic,
						logintime : userMsg.logintime,
						regtime : userMsg.regtime,
						active : userMsg.active,
						shouC : userMsg.shouC
					}
					res.redirect('/topic/'+msg._id);	
				});
			});
			
		}
	});
}

// 跳转到话题详情页
topicCtrl.show = function(req,res){
	
	var con ={
		_id : req.params._id
	}

	// 使用 eventproxy 模块 可以有效的解决 异步导致的结束时间不一致
	// 首先下载 eventproxy 模块   
	// 加载 eventproxy  
	// 创建一个监听对象
	var ep = new eventProxy();
	ep.all('info','other','replydata','nores',function(data,msg,replydata,noresmsg){
		res.render('show',{data:data,other:msg,replydata:replydata,nores:noresmsg});
	});

	// 查询该话题的回复 
	replyModel.find({topic:req.params._id}).populate('user',{userpic:1,username:1}).populate('topic').exec(function(err,replydata){
		ep.emit('replydata',replydata);
	});
	// console.log(req.params);
	//更新浏览量 查询话题的详情  并查找与之关联的用户 和话题类别
	topicModel.update(con,{$inc:{viewnum:1}},function(err){
		// console.log(err);
		topicModel.findOne(con).populate('cate',{catename:1}).populate('user',{username:1,userpic:1,gold:1,mark:1,nickname:1}).populate('reply').exec(function(err,data){
			// console.log(data);
			// 触发事件
			ep.emit('info',data)
		});
	});

	// 查询用户其他的话题
	// 先查询用户的_id 根据_id进行查找发布过的话题
	topicModel.findOne(con,{user:1},function(err,msg){
		// console.log(msg);
		var newcon = {_id:msg.user,_id:{$ne:{_id:con._id}}};
		topicModel.find(newcon,{topicname:1},function(err,msg){
			// console.log(msg);
			// 触发一次 并携带参数过去
			ep.emit('other',msg);
		}).limit(5);
	});

	// 无人回复的话题
	topicModel.find({reply:{$size:0}},function(err,noresmsg){
		// console.log(msg);
		ep.emit('nores',noresmsg);
	});
}

// 定义处理回复话题的操作
topicCtrl.reply = function(req,res){
	// console.log(req.body);
	// console.log(req.params);
	// console.log(req.session.user);
	
	var con = {
		_id : req.params._id
	}
	// 查询当前登陆用户
	topicModel.findOne(con,function(err,msg){
		// console.log(msg)
		var data = {
			topic : req.params._id,
			user : req.session.user._id,
			content : req.body.content ,
			lou : msg.reply.length+1
		}
		//console.log(data);
		// 将数据插入回复回复集合中
		replyModel.create(data,function(err,msg){
			//console.log(msg);
			// 将回复信息的_id 压入到topic集合中的replay数组
			topicModel.update(con,{$push:{reply:msg._id}},function(err,msg){
				// console.log(err);
				res.redirect('back');
			})
		});
	});
}
// 定义点赞的操作
topicCtrl.clickGd = function(req,res){
	// console.log(req.query);
	var con = {
		_id : req.query.reply,
		like  : req.session.user._id
	}
	console.log(con);
	replyModel.findOne(con,function(err,data){
		if(data){
			var con = {
				_id : req.query.reply
			};

			// 数据
			var data = {$pull:{like:req.session.user._id}};

			// 将当前用户的_id的值压入该数组单元中
			replyModel.update(con,data,function(err){
				if(err){
					res.send('error');
				}else{
					res.send('likecancel');
				}
			});
		}else{
			var con ={
				_id : req.query.reply
			}
			var datas = {$push:{like:req.session.user._id}};
			replyModel.update(con,datas,function(err){
				if(err){
					res.send('error');
				}else{
					res.send('like');
				}
			});
		}
	});
	
}

// 定义收藏
topicCtrl.sC = function(req,res){
	// console.log(req.query);
	var con = {
		_id : req.session.user._id
	}
	var datas = {$push:{shouC:req.query._id}}
	// 往users的字段shouC中插入 datas
	userModel.update(con,datas,function(err,msg){
		console.log(err);
		if(err){
			res.send('nok');
		}
		res.send('ok');
	});

}

// 定义取消收藏
topicCtrl.nsC = function(req,res){
	console.log(req.query);
	var con = {
		_id : req.session.user._id
	}
	var datas = {$pull:{shouC:req.query._id}}
	// 往users的字段shouC中插入 datas
	userModel.update(con,datas,function(err,msg){
		// console.log(err);
		if(err){
			res.send('nok');
		}
		res.send('ok');
	});

}

// 定义编辑话题
topicCtrl.edit = function(req,res){
	var con = {
		_id : req.params._id
	}
	var ep = new eventProxy();
	ep.all('cates','data',function(date,data){
		res.render('edit',{cates:date,data:data});
	});
	// console.log(con);
	cateModel.find(function(err,date){
		// console.log(date);
		// console.log(err);
		ep.emit('cates',date)
	}).sort({orderNum:1});

	topicModel.findOne(con).populate('cate',{catename:1}).exec(function(err,data){
		ep.emit('data',data)
	});
	
}

// 定义处理编辑信息的操作
topicCtrl.doEdit = function(req,res){
	var con = {
		_id:req.params._id
	}
	var datas = {
		cate:req.body.cate,
		topicname:req.body.title,
		content:req.body.content
	}
	// console.log(con);
	// console.log(req.body);
	// console.log(datas);
	
	topicModel.update(con,datas,function(err,msg){
		if(err){
			console.log(err)
		}
		res.redirect('/topic/'+req.params._id);
	});
}

// 定义删除话题的操作
topicCtrl.delete = function(req,res){
	var con = {
		_id:req.params._id
	}
	console.log(con);
	topicModel.remove(con,function(err,msg){
		if(err){
			console.log(err)
		}
		res.redirect('/');
	});
}
// 向外暴露
module.exports = topicCtrl;