// 加载加密模块
var crypto = require('crypto');

// 定义加密字符串的方法  有一个参数 str  字符串类型的

function cryptoStr(str){
	return crypto.createHash('md5').update(str).digest('hex');
}

// 暴露

module.exports = cryptoStr;