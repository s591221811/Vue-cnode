// 发送邮件验证的模块

// 加载模块
var nodemailer = require('nodemailer');

/**
* 定义发送邮件验证服务的方法 sendMail()
* @param string email 要发送邮件的email地址
* @param string username 用户名
* @param string _id 用户的_id
* @param function cb 接收错误信息的回调函数
*/

function sendMail(email,username,_id,cb){
	// smtp服务器，用于发送邮件
	// 使用QQ的smtp服务发送邮件验证
	var transporter = nodemailer.createTransport({
		// 什么smtp服务器
		host : 'smtp.qq.com',

		auth:{
			// 账户
			user : '3043973225@qq.com',
			// 密码(授权码)
			pass : 'unhaoxersfmvdeja'
		}
	});


	// 设置邮件发送选项
	var mailOptions = {
		from : '"XDLNode官网" <3043973225@qq.com>',
		to : email,
		subject : '欢迎尊贵的'+username+'注册XDLNode官网，请激活账户',
		html : '点击以下<a href="http://192.168.125.24/verifyEmail?_id='+_id+'">链接</a>进行激活'
	};

	// 发送邮件
	transporter.sendMail(mailOptions,function(err,info){
		// console.log(err);
		// console.log(info);

		// 将错误信息传递给cb
		cb(err)
	});
}

// 向外暴露
module.exports = sendMail;
	