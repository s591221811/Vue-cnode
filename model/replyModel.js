// 加载数据库配置文件
var mongoose = require('../config/db_config');

// 定义集合的骨架

var  replySchema = new mongoose.Schema({
		// 关联那个话题
		topic:{
			type:'ObjectId',
			ref:'topic'
		},
		// 那个用户回复的
		user:{
			type:'ObjectId',
			ref:'user'
		},
		content:{
			type:String
		},
		lou:{
			type:Number
		},
		like:[
			{
				type:'ObjectId',
				ref:'user'
			}
		],
		replyTime:{
			type:Date,
			default:new Date()
		}
});


// 创建以replaySchema为骨架的集合repies
var replyModel = mongoose.model('reply',replySchema);


// 将创建的集合模板向外暴露
module.exports = replyModel;