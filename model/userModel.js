// 加载数据库配置文件 
var mongoose = require('../config/db_config');

// 定义集合骨架
var  userSchema = new mongoose.Schema({
	 username:{
	 	type:String,
	 	// 表示唯一
	 	unique:true
	 },
	 userpwd : String,
	 nickname :{
		type:String
	 } ,
	 email :{
	 	type : String,
	 	unique : true
	 },
	 userpic : {
	 	type :String,
	 	default:''
	 },
	 regtime : {
	 	type : Date,
	 	default : new Date()
	 },
	 logintime : {
	 	type : Date,
	 	default : new Date()
	 },
	 regIp : String,
	 gold :{
	 	type : Number,
	 	default : 0
	 },
	 level : {
	 	type : Number,
	 	default : 0
	 },
	 mark : {
	 	type : String,
	 	default:''
	 },
	 active:{
	 	type:Number,
	 	default:0
	 },
	 shouC:[
		 {
		 	type:'ObjectId',
		 	ref:'topic'
		 }
	 ],
	 feng:{
	 	type:Number,
	 	default:1
	 }

});


// 创建集合的模板
var userModel = mongoose.model('user',userSchema);

// 将创建的集合向外暴露 

module.exports = userModel;