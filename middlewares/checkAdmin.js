function checkAdmin(req,res,next){
	// console.log(req.session.user)
	if(req.session.user && parseInt(req.session.user.level)==1){
		// console.log(111);

		next();
	}else{
		res.redirect('/login');
		// console.log(222);
	}
}

module.exports = checkAdmin;