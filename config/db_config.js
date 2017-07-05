// 定义连接数据库的配置文件

// 加载mongoose模块
var  mongoose = require('mongoose');

//定义数据库的地址
var  mgUrl = 'mongodb://xh:123@localhost:27017/cnode';

// 连接数据库

mongoose.connect(mgUrl,function(err){
	if(err){
		console.log('数据库未连接')
		return;
	}
});

// 向外暴露
module.exports = mongoose;