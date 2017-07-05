// 定义topic的集合模板
// 加载模块
var mongoose = require('../config/db_config');
// 定义骨架

var topicSchema = new mongoose.Schema({
	topicname:String,
	cate:{
		type:'ObjectId',
		ref : 'cate'
	},
	user:{
		type:'ObjectId',
		ref : 'user'
	},
	content:{
		type:String
	},
	// 创建时间 
	createTime:{
		type : Date,
		default : new Date() 
	},
	// 最后一次修改时间
	editTime:{
		type: Date,
		default : new Date()
	},
	isTop:{
		type:Number,
		default:0
	},
	isJing:{
		type:Number,
		default:0
	},
	// 访问量
	viewnum :{
		type:Number,
		default:0
	},
	reply:[
		{
			type:'ObjectId',
			ref:'reply'
		}
	]
});

// 创建模型
var topicModel = mongoose.model('topic',topicSchema);

// 向外暴露
module.exports = topicModel;