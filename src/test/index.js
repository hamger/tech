// // 函数节流（A事件执行后的时间 T 内不再重复执行）
// function throttle(fn, time = 500) {
// 	var canrun = true
// 	return function (...args) {
// 		if (!canrun) return
// 		canrun = false
// 		fn.apply(this, args)
// 		setTimeout(() => {
// 			canrun = true
// 		}, time)
// 	}
// }

// // 防抖，时间 T 后执行函数，若期间有调用，则重新计时
// function debounce(fn, time = 500) {
// 	var timer = null
// 	return function (...args) {
// 		if (timer) {
// 			clearTimeout(timer)
// 		}
// 		timer = setTimeout(() => {
// 			fn.apply(this, args)
// 		}, time)
// 	}
// }

// var num = 1;
// var obj = {
//     num: 2,
//     add: function() {
//         this.num = 3;
//         // 这里的立即指向函数，因为我们没有手动去指定它的this指向，所以都会指向window
//         (function() {
//             // 所有这个 this.num 就等于 window.num（严格模式下输出 undefined）
//             console.log(this.num);
//             this.num = 4;
//         })();
//         console.log(this.num);
//     },
//     sub: function() {
//         console.log(this.num)
//     }
// }
// /**
//  * 在通过obj.add 调用add 函数时，函数的this指向的是obj,这时候第一个this.num=3
//  * 相当于 obj.num = 3 但是里面的立即指向函数this依然是window,
//  * 所以 立即执行函数里面console.log(this.num)输出1，同时 window.num = 4
//  *立即执行函数之后，再输出`this.num`,这时候`this`是`obj`,所以输出3
//  */
// obj.add() // 输出 1 3

// // 通过上面`obj.add`的执行，obj.name 已经变成了3
// console.log(obj.num) // 输出3
// // 这个num是 window.num
// console.log(num) // 输出4（严格模式下输出 1）
// // 如果将obj.sub 赋值给一个新的变量，那么这个函数的作用域将会变成新变量的作用域
// const sub = obj.sub
// // 作用域变成了window window.num 是 4
// sub() // 输出4

// let num = 10
// const obj = {num: 20}
// obj.fn = (function (num) {
//   this.num = num * 3
//   num++
//   return function (n) {
//     this.num += n
//     num++
//     console.log(num)
//   }
// })(obj.num)
// let fn = obj.fn
// fn(5)
// obj.fn(10)
// console.log(num, obj.num)

// var num = 10
// const obj = {num: 20}
// obj.fn = (function (num) {
//   this.num = num * 3
//   num++
//   return function (n) {
//     this.num += n
//     num++
//     console.log(num)
//   }
// })(obj.num)
// var fn = obj.fn
// fn(5)
// obj.fn(10)
// console.log(num, obj.num)

function permute(arr) {
    var res = []
    // nums：选择；track：路径；
    function backtrack(nums, track) {
        if (track.length === nums.length) {
            // 需要克隆结果，避免引用类型的影响
            res.push(JSON.parse(JSON.stringify(track)))
            return
        }
        for (var i = 0; i < nums.length; i++) {
            // 排除在路径里的选择
            if (track.indexOf(nums[i]) > -1) {
                continue
            }
            track.push(nums[i])
            backtrack(nums, track)
            track.pop()
        }
    }
    backtrack(arr, [])
    return res
}
console.log(permute([1, 2, 3]))

// 组合求和
function combinationSum(candidates, target) {
    var res = []
    // 降序排列
    var source = candidates.sort((a, b) => b - a)
    var n = source.length
    function helper(i, tmp_sum, tmp) {
        if (tmp_sum > target || i == n) return
        if (tmp_sum === target) {
            res.push(tmp)
            return
        }
        helper(i, tmp_sum + candidates[i], tmp + [candidates[i]])
        helper(i + 1, tmp_sum, tmp)
    }
    helper(0, 0, [])
    return res
};
console.log(combinationSum([2, 3, 6, 7], 7))

// 固定参数的柯里化
function curry(fn, ...arg) {
    var _arg = [].concat(arg)
    var len = fn.length

    return function _fn(...arg2) {
        _arg.push(...arg2)
        if (_arg.length === len) {
        // if (arg2.length === 0) { // 不定参数的柯里化
            return fn.apply(this, _arg)
        } else {
            return _fn
        }

    }
}
// 不定参数的柯里化
function curry(fn) {
  // 保存预置参数
  const presetArgs = [].slice.call(arguments, 1)
  // 返回一个新函数
  function curried () {
    // 新函数调用时会继续传参
    const restArgs = [].slice.call(arguments)
    const allArgs = [...presetArgs, ...restArgs]
    return curry.call(null, fn, ...allArgs)
  }
  // 重写toString
  curried.toString = function() {
    return fn.apply(null, presetArgs)
  }
  return curried;
}

var f1 = async function (params) {
    console.log('f1') // 2
    await f()
    console.log('f2') // 5
}
function f() {
    console.log('f') // 3
}
console.log('FB') // 1
f1() 
console.log('FE') // 4