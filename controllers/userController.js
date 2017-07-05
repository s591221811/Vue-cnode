// 加载数据库模板模块
var userModel = require('../model/userModel');
// 加载话题模板
var topicModel = require('../model/topicModel');
// 加载配置好的上传文件的模块
var fileUpload = require('../config/fileUpload');
// 加载配置缩放图片的模块
var resizeImg = require('../config/resizeImg_config');
// 加载发送邮件的配置模块
var sendEmail =  require('../config/email');
// 加载加密密码模块
var crypto = require('../config/crypto_config');
// 加载发送短信的模板
var sendYZ = require('../dayu/ceshi');
// 加载事件模块
var eventProxy = require('eventproxy');

// 定义一个控制器
var  userCtrol = {};

// 定义路由/ucenter 的回调函数  userCtrol.center 
userCtrol.ucenter = function(req,res){
	res.render('ucenter');
}

// 定义处理更改个人信息的操作
userCtrol.setting = function(req,res){
	// 获取session的_id值作为更新条件
	var con = {
		_id : req.session.user._id
	}
	var updateDate = {
		nickname:req.body.nickname,
		mark:req.body.mark
	}
	// console.log(con)
	// console.log(updateDate)
	// 更新数据
	userModel.update(con,updateDate,function(err){
		if(err){
			// console.log(err)
			// 更新失败 向模板发送 数据异常请重试
			return;
		}
		// 重新创建session
		// 重新查询用户信息
		userModel.findOne(con,function(err,msg){
			req.session.user = {
					username : msg.username,
					_id : msg._id,
					email : msg.email,
					nickname :　msg.nickname,
					mark  : msg.mark,
					level : msg.level,
					gold : msg.gold,
					userpic : msg.userpic,
					logintime : msg.logintime,
					regtime : msg.regtime,
					active : msg.active
				}
			// 返回到之前的页面
			res.redirect('back');
		});
	});
	//res.send('正在处理');
}

//定义处理上传头像的方法  imgSet  用于存储上上传头像和进行头像的缩放
userCtrol.imgSet = function(req,res){
	var savePath = './uploads';
	var fileType = ['image/jpeg','image/png','image/gif'];
	var upload = fileUpload(savePath,fileType).single('userpic');
	upload(req,res,function(err){
		if(err){
			switch(err.code){
				case 'filetype no':
					var errorMsg = '文件类型不符合';
				break;
				case 'LIMIT_FILE_SIZE':
					var errorMsg = '文件过大';
				break;
			}
			// 创建一次性携带参数 
			req.flash('errImg',errorMsg);
			// 返回到刚才的页面
			res.redirect('back');
		}else{
			// 对用户头像进行缩放
			var imgSrc = req.file.path;
			resizeImg(imgSrc);
			var con = {
				_id : req.session.user._id
			}
			var updates = {
				userpic : req.file.filename
			}

			// console.log(updates);
			// console.log(con);
			// console.log(111);
			// 更新数据库userpice信息
			userModel.update(con,updates,function(){
				if(err){
					// 提示用户数据异常让他重试
				}else{
					// 重新查询用户信息 进行用户session信息的更新
					userModel.findOne(con,function(err,msg){
						// 更新session
						req.session.user = {
							username : msg.username,
							_id : msg._id,
							email : msg.email,
							nickname :　msg.nickname,
							mark  : msg.mark,
							level : msg.level,
							gold : msg.gold,
							userpic : msg.userpic,
							logintime : msg.logintime,
							regtime : msg.regtime,
							active : msg.active
						}
						// 返回到刚才的页面
						res.redirect('back');
					});
				}
			});
		}
	});
}

// 定义处理更换邮箱的方法  emailSet 
userCtrol.emailSet = function(req,res){
	//获取session存储的_id
	var _id = req.session.user._id;
	// 获取传递的邮箱地址
	var email = req.body.email;
	// 获取用户名
	var username = req.session.user.username;
	// console.log(_id);
	// console.log(email);
	// console.log(username);
	sendEmail(email,username,_id,function(err){
		if(err){
			// 提示用户发送错误 重新发送
			console.log('错了')
		}else{
			req.session.email=email;
			// console.log(req.session.email);
			res.redirect('/emailtip');
		}
	});
}

// 定义验证邮箱的操作  verfyEmail
userCtrol.verfyEmail = function(req,res){
	// console.log(req.session.user);
	// res.render('ucenter');
	var con = {
		_id : req.query._id
	}
	console.log(con);
	var updates = {
		email : req.session.email
	}
	console.log(updates);
	userModel.update(con,updates,function(err,msg){
		if(err){
			// 如果有错误就 生成错误信息 提示用户 数据异常 请重试
			console.log(111)
		}else{
			// 查询数据库重新创建session信息  返回到ucenter
			userModel.findOne(con,function(err,msg){
				// 到这一步了怎么可能查不到
				req.session.user = {
					username : msg.username,
					_id : msg._id,
					email : msg.email,
					nickname :　msg.nickname,
					mark  : msg.mark,
					level : msg.level,
					gold : msg.gold,
					userpic : msg.userpic,
					logintime : msg.logintime,
					regtime : msg.regtime,
					active : msg.active		
				}
				res.redirect('/user/ucenter');
			});
		}
	});
}

// 定义验证密码的操作  checkPwd
userCtrol.checkPwd = function(req,res){
	var con = {
		_id : req.session.user._id
	}
	var pwd = crypto(req.query.userpwd);
	// console.log(con);
	userModel.findOne(con,function(err,msg){
		//console.log(msg.userpwd);
		if(msg.userpwd==pwd){
			res.send('ok')
		}else{
			res.send('nok')
		}
	});
}

var cNum = 2531;
// 定义发送验证码的操作  sendDx
userCtrol.sendDx = function(req,res){
	var num = req.query.phNum;
	
	sendYZ(num,cNum);
	res.send(200,cNum);
}

// 定义修改密码的操作 
userCtrol.make = function(req,res){
	 // console.log(req.session.user);
	 var con = {
	 	_id : req.session.user._id
	 }
	 userModel.findOne(con,function(err,msg){
	 	 // console.log(cNum);
	 	if(crypto(req.body.old_pass)==msg.userpwd && parseInt(req.body.cNum)==cNum){
	 		var data = {
	 			userpwd :crypto(req.body.new_pass)
	 		}
	 		// console.log(data)
	 			userModel.update(con,data,function(err){
	 				if(err){
	 					console.log(err);
	 				}else{
	 					res.redirect('/login')
	 				}
	 			})
	 	}
	 });
}

// 定义关于用户的相关信息的操作
userCtrol.user = function(req,res){
	// res.send('获取中')
	var con = {
		user:req.params._id
	}
	var con1 = {
		_id : req.params._id
	}
	// 定义事件对象
	var ep = new eventProxy();
	ep.all('datas','sc',function(datas,sc){
		res.render('myTorS',{data:datas.data,info:datas.info,sc:sc})
	});
	// console.log(con);
	// 查询关联改用户的信息以及所有话题
	userModel.findOne(con1,function(err,info){
		// console.log(info);
		topicModel.find(con).limit(10).sort({regtime:-1}).populate('user').populate('reply').exec(function(err,msg){
			console.log(msg);
			var datas = {
				data:msg,
				info:info
			}
			ep.emit('datas',datas);
		});
	});

	// 查询用户的收藏
	userModel.findOne(con1).populate('shouC').exec(function(err,sc){
		// console.log(msg);
		ep.emit('sc',sc);
	})
	

}

// 将控制器向外暴露
module.exports = userCtrol;