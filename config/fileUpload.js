// 配置上传文件的存储对象
// 加载文件上传模块
var multer = require('multer');
// 加载随机数方法
var uid =  require('uid');
// 加载格式化时间模块
var timeStamp = require('time-stamp');
// 加载路径模块  
var path = require('path');

// 将配置上传文件的配置封装成一个方法 fileUpload
// 需要三个参数  文件存储地址  savePath  文件的大小 filesize  文件的类型 filetype  
// 需求 文件大小限制可写 可不写   

function fileUpload(savePath,filetype,filesize){
	var storage = multer.diskStorage({
		destination:savePath,
		filename : function(req,file,cb){
			var filename = timeStamp('YYYYMMDDHHmmssms')+uid(10)+path.extname(file.originalname);
			cb(null,filename);
		}
	});
	function fileFilter(req,file,cb){
		if(filetype.indexOf(file.mimetype)==-1){
			cb(null,false);
			var err = new Error('文件类型不符');
			err.code = 'filetype no';
			cb(err);
		}else{
			cb(null,true);
		}
	}
	var options = {
		storage : storage,
		fileFilter : fileFilter,
		limits : {	
		}
	}
	if(filesize){
		options.limits.fileSize = filesize;
	}

	var upload = multer(options);
	return upload;
}


module.exports = fileUpload;