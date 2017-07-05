
// 将检验用户是否登陆的中间件封装成一个模块
var checkUser = function(req,res,next){
	if(req.session.user){
		next();
	}else{
		res.redirect('/login')
	}
}

//暴露

module.exports = checkUser;