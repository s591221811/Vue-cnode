// 定义计算多久时间前

function timeQ(old){
	var  now = new Date();
	var old = new Date(old);
	var cha = now.getTime()-old.getTime();
	if(60>Math.floor(cha/1000/60)>=1){
		return Math.floor(cha/1000/60)+'分钟前';
	}else if(24>Math.floor(cha/1000/60/60)>=1){
		return Math.floor(cha/1000/60/60)+'小时前';
	}else if(30>Math.floor(cha/1000/60/60/24)>=1){
		return Math.floor(cha/1000/60/60/24)+'天前';
	}else if(12>Math.floor(cha/1000/60/60/24/30)>=1){
		return Math.floor(cha/1000/60/60/24/30)+'月前';
	}else if(Math.floor(cha/1000/60/60/24/30/12)>=1){
		return Math.floor(cha/1000/60/60/24/30)+'年前';
	}else{
		return '1年前'
	}
	
}

module.exports = timeQ;