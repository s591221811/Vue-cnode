// 加载模板
var mongoose = require('../config/db_config');

// 创建骨架 
var cateSchema = new mongoose.Schema({
	// 话题名称
	catename:{
		type:String,
		unique:true
	},
	// 用来进行排序的编号
	orderNum: {
		type : Number
	}
});

// 创建数据库模板
var cateModel = mongoose.model('cate',cateSchema);

// var data = [
// 	{
// 		catename:'分享',
// 		orderNum:1
// 	},
// 	{
// 		catename:'问答',
// 		orderNum:2
// 	},
// 	{
// 		catename:'招聘',
// 		orderNum:3
// 	}
// ]

// cateModel.create(data,function(err,msg){
// 	console.log(err);
// 	console.log(msg);
// });

// 将模型向外暴露
module.exports = cateModel;