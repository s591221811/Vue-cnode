// 发送邮件验证的模板 
// 加载模块
var nodemailer  = require('nodemailer');

// 定义发送邮件验证服务的方法 senEmail()  
// 需要 发送邮件的地址  email   用户名  username  用户信息的_id的值  接收错误信息的 回调函数

function sendEmail(email,username,_id,router,cb){
	// 设置smtp服务器 
	var transporter = nodemailer.createTransport({
		host:'smtp.qq.com',
		auth:{
			user : '3043973225@qq.com',
			pass :'dyqqpgeireppdhai'
		}
	});
	//邮件设置
	var mailOptions = {
		from : '"XDLNode官网" <3043973225@qq.com>',
		to : email,
		subject : '欢迎尊贵的'+username+'注册XDLNode官网，请激活账户',
		html : '点击以下连接进行验证<a href="http://192.168.125.24/user/'+router+'?_id='+_id+'">链接</a>进行激活'
	};
	transporter.sendMail(mailOptions,function(err,info){
		cb(err);
	});
}

module.exports = sendEmail;