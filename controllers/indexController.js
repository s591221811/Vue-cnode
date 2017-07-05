// 加载数据库模板
var userModel = require('../model/userModel');
// 加载加密配置模板
var crypto = require('../config/crypto_config');
// 加载话题模板模块
var  topicModel = require('../model/topicModel');
// 加载话题类别模块
var  cateModel = require('../model/cateModel');
// 加载监听对象模块
var eventProxy = require('eventproxy');

var sendMail = require('../config/email_config');

// 定义一个控制器对象
var  indexControl = {};

// 首页  // 查询所有的话题 来进行分页
indexControl.index = function(req,res){
	// 定义每页限制的条目
	var limitNum = 3 ;
	// 定义页数 
	var page = req.query.page?parseInt(req.query.page):1;
	// 实例化一个监听对象
	var  ep = new eventProxy();
	// 设置监听的事件
	ep.all('topicInfo','cateInfo','gold','nores',function(topicInfo,catedata,goldInfo,noresmsg){
		res.render('index',{data:topicInfo.data,maxPage:topicInfo.maxPage,page:topicInfo.page,cate:topicInfo.cate,cates:catedata,gold:goldInfo,nores:noresmsg});
	});

	var con = {

	}
	if(req.query.cate){
		con.cate  = req.query.cate
	}
	// 查询所有的话题数目
	topicModel.find(con).count(function(err,msg){
		// console.log(msg);
		// 最大页数  
		var maxPage = msg/limitNum;
		if(page>maxPage){
			page=maxPage
		}
		if(page<1){
			page=1
		}
		// console.log(typeof page);
		// 定义跳过的条数
		var ofsPage = (page-1)*limitNum;
		// 查询所有的话题详情
		var sortCon = {regtime:-1,isTop:-1}
		topicModel.find(con,{topicname:1,isTop:1,isJing:1,_id:1,viewnum:1,cate:1,user:1,reply:1}).sort(sortCon).populate('cate',{catename:1}).populate('user',{userpic:1}).skip(ofsPage).limit(limitNum).exec(function(err,data){
			var topicInfo = {
					data:data,
					maxPage:maxPage,
					page:page,
					cate:req.query.cate
				}
			

			ep.emit('topicInfo',topicInfo);
		});

	});

	// 从cates数据库中查询话题名
	cateModel.find({},{catename:1},function(err,catedata){
		// console.log(catedata);
		ep.emit('cateInfo',catedata);
	}).sort({ordernum:1})
	
	// 查询积分进行排序
	userModel.find({},{gold:1,username:1}).sort({gold:-1}).exec(function(err,goldInfo){
		// console.log(goldInfo);
		ep.emit('gold',goldInfo)

	});
	// 查询无人回复的话题
	topicModel.find({reply:{$size:0}},function(err,noresmsg){
		// console.log(msg);
		ep.emit('nores',noresmsg);
	});
	
};
// 注册界面
indexControl.zhuce = function(req,res){
	res.render('zhuce');
};
// 验证用户名
indexControl.checkUname = function(req,res){
	// 获取传输的数据
	var con = {
		username:req.query.username
	}
	userModel.findOne(con,function(err,data){
		//console.log(data);
		//console.log(err)
		if(data){
			res.send('used')
		}else{
			res.send('ok')
		}
	});
};
// 验证邮箱
indexControl.checkEmail = function(req,res){
	// 获取传输的数据
	var con = {
		email:req.query.userEmail
	}
	
	userModel.findOne(con,function(err,msg){
		//console.log(err)
		if(msg){
			res.send('used')
		}else{
			res.send('ok')
		}
	});
};
// 注册处理
indexControl.dozhuce = function(req,res){
	
	var userDate = {
		 username : req.body.username, 
		 userpwd : crypto(req.body.userpwd), 
		 email : req.body.emails,
		 nickname : req.body.username,
		 regIp : req.ip.slice(7)
		}
		// console.log(userDate);
	userModel.create(userDate,function(err,msg){
		// 如果 错误信息存在说明 没有注册成功 返回重新注册  并携带错误信息
		if(err){
			res.redirect('/zhuce');
			return;
		}else{
			//console.log(msg);

		// 如果没有 用户直接登陆上去  让头部显示登录
		// 创建session  将session挂在到全局对象res.locals上 供模板使用
		req.session.user = {
			username : msg.username,
			_id : msg._id,
			email : msg.email,
			nickname :　msg.nikname,
			mark  : msg.mark,
			level : msg.level,
			gold : msg.gold,
			userpic : msg.userpic,
			logintime : msg.logintime,
			regtime : msg.regtime
		}
		var router = 'verifyEmail';
		// 右键发送 成功跳转到提示用户发送成功让他去验证的界面
		sendMail(msg.email,msg.username,msg._id,router,function(err){
			if(err){
				// 在页面中提示用户激活邮件发送失败！
				// 在个人信息中重新发送邮件激活
			}else{
				// 没有问题
				// 跳转到邮件激活提示页
				res.redirect('/emailtip');
			}
		});	

		}	

	});
};

// 登陆界面
indexControl.login = function(req,res){
	res.render('login');
};

// 登陆处理
indexControl.dologin = function(req,res){
	// 获取传输的数据 在数据库中查询 能查找到就说明帐号有效 不能账号就没效
	var con = {
		username:req.body.username,
		userpwd : crypto(req.body.userpwd)
	}
	userModel.findOne(con,function(err,msg){
		if(msg){
			// 存在证明注册过 然后判断是否激活了邮件 
			if(msg.active==0){

				res.redirect('/emailtip')
				// 停止程序
				return;
			}else if(msg.feng==0){
				req.flash('errInfo','改账户已经被封停');
				res.redirect('back');
				return;
			}else{
				// 创建session
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
					shouC : msg.shouC
				}
				console.log(req.session.user);
				//console.log(req.session)
				// 跳转到首页
				res.redirect('/');  
			}
			
		}else{
			// 说明未注册 或者帐号密码错误  定义一次性错误参数
			req.flash('errInfo','帐号密码错误');
			res.redirect('back');
		}
	});
};

// 提示需要激活界面
indexControl.emailtip = function(req,res){
	res.render('emailtip')
}

// 激活成功操作  通过携带的_id的值  更改 数据的active的值 然后跳转到首页
indexControl.verifyEmail = function(req,res){
	// console.log(req.query._id);
	// 定义查询条件
	var con = {
		_id :　req.query._id
	}
	var userActive = {
		active : 1
	}
	// console.log(con);

	// 进行数据更新  
	userModel.update(con,userActive,function(err,msg){
		if(err){
			// 如果err存在 说明数据异常向客户端传输错误信息
		}else{
			userModel.findOne(con,function(err,msg){
				// 重新创建session
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
				console.log(req.session.user);
				// 跳转到首页
				res.redirect('/');
			});
		}
	});
	//res.send('激活');
}

// 进行退出操作 删除session返回首页
indexControl.logout = function(req,res){
	delete req.session.user;
	res.redirect('back')
}

// 重置密码操作
indexControl.reset = function(req,res){
	res.render('reset');
}

// 重置密码操作
indexControl.doreset = function(req,res){
	var email = req.body.email;
	var con = {
		 username : req.body.username
	}
	userModel.findOne(con,function(err,msg){
		if(email!=msg.email){
			//创建一次性错误信息
			req.flash('errInfo','邮箱不正确');
			res.redirect('back');
		}else{
			// 发送验证短信
			var router = 'verifyPass'
			sendMail(msg.email,msg.username,msg._id,router,function(err){
				if(err){
					// 在页面中提示用户激活邮件发送失败！
					// 在个人信息中重新发送邮件激活
				}else{
					// 没有问题
					// 跳转到邮件激活提示页
					res.redirect('/emailtip');
				}
			});	
		}
	});
	
}



// 将首页控制器向外暴露 
module.exports = indexControl;