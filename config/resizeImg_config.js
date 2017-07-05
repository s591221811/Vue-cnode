// 加载gm模块
var gm =  require('gm');

// 定义缩放图片的方法 
// 有一个参数 图片的地址 imgSrc
function resizeImg(imgSrc){
	gm(imgSrc).resize(48,48).write(imgSrc,function(err){
		console.log(err);
	});
}

module.exports = resizeImg;