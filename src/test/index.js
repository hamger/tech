// 函数节流（A事件执行后的时间 T 内不再重复执行）
function throttle(fn, time = 500) {
	var canrun = true
	return function (...args) {
		if (!canrun) return
		canrun = false
		fn.apply(this, args)
		setTimeout(() => {
			canrun = true
		}, time)
	}
}

// 防抖，时间 T 后执行函数，若期间有调用，则重新计时
function debounce(fn, time = 500) {
	var timer = null
	return function (...args) {
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(() => {
			fn.apply(this, args)
		}, time)
	}
}

var num = 1;
let obj = {
	num: 2,
	add: function () {
		this.num = 3;
		(function () {
			console.log('add', this);
			console.log(this.num);
			this.num = 4;
		})();
		console.log(this.num);
	},
	sub: function () {
		console.log('sub', this)
		console.log(this.num)
	}
}
obj.add(); // undefined, 3
console.log(obj.num); // 3
console.log(num); // 1
const sub = obj.sub;
sub(); // 4

// 作为普通函数调用：严格模式下，this的值是undefined，非严格模式下，this指向全局对象。
// 严格模式： undefined, 3, 3, 1, 4
// 非严格模式：1, 3, 3, 4, 4