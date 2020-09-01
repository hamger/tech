### 函数节流（throttle）与函数去抖（debounce）

设定一个执行周期为 T。节流：当前后调用的时间间隔小于 T 则不执行该动作，反之则执行。
```js
function throttle (fn, times) {
    var canRun = true
    return function (...args) {
        if (!canRun) return false
        canRun = false
        fn.apply(this, args)
        setTimeout(() => {
            canRun = true
        }, times || 500)
    }
}
var tn = throttle(q => {console.log(q)})
tn(12)
tn(12)
// 只输出一次： 12
```
去抖：当调用动作 T 后，才会执行该动作，若在 T 内又调用此动作则重新计算执行时间。
```js
function debounce (fn, times) {
    return function (...args) {
        clearTimeout(timer)
        var timer = setTimeout(() => {
            fn.apply(this, args)
        }, times || 500)
    }
}
var dn = debounce(q => {console.log(q)})
dn(13)
setTimeout(() => dn(13), 400)
// 在 900 毫秒之后输出一次： 13 
```

### 千位分隔

使用正则：

```js
function numFormat(num) {
  num = num.toString().split(".");
  var reg = /(?=(\B\d{3})+$)/g;
  var integer = num[0].replace(reg, ",");
  return num[1] ? integer + "." + num[1] : integer;
}
```

不使用正则：

```js
function numFormat(num) {
    num = num.toString().split('.');
    var arr = num[0].split('').reverse();
    var res = arr.reduce((total, cur, idx) => {
        total.push(cur)
        if (idx !== 0 && idx % 3 === 0) total.push(',')
        return total
    }, [])
    var integer = res.reverse().join('');
    return num[1] ? integer + '.' + num[1] : integer;
}
console.log(numFormat(12345678.1233)) // 1,234,5678.1233
```

### 简述 == 机制
```js
[] == ![]// true
```
涉及到js中的隐式强制类型转换，具体步骤如下：
1. 如果有一个操作数是布尔值，则在比较相等性之前先将其转换为数值（false 转换为 0，true 转换为 1）。
2. 如果一个操作数是字符串，另一个操作数是数值，在比较相等性之前先将字符串转换为数值。
3. 如果一个操作数是对象，另一个操作数不是，则调用对象的valueOf()方法，如果得到的值不是基本类型值，则基于返回值再调用toString方法（这个过程即ToPrimitive），用得到的基本类型值按照前面的规则进行比较。
4. 如果两个操作数都是对象，则比较他们是不是同一个对象。如果两个操作数指向同一个对象，则相等操作符返回true, 否则返回false。

根据上面的步骤，解释`[] == ![]`的转化过程:
```js
[] == ![]
[] == false
[] == ToNumber(false)
[] == 0
ToPrimitive([]) == 0
'' == 0 // Number('') = 0
0 == 0 // -> true
```

根据步骤4可得知：
```js
var a = {}
a == '[object Object]' // true
```


### valueOf 和 toString

基本上所有的 JavaScript 数据类型都有 valueOf()，toString()方法，null 除外，这两个方法解决了 JavaScript 值运算和显示的问题。

- valueOf() 会把数据类型转换成原始类型
- toString() 会把数据类型转换成 string 类型

这两个方法有意思的地方在于什么时候使用，总结如下：
1、valueOf()偏向于运算，toString()偏向于显示
2、对象转换时，优先调用 toString()
3、强转字符串的情况下，优先调用 toString()方法；强转数字的情况下优先调用 valueOf()
4、正常情况下，优先调用 toString()
5、在有运算操作符的情况下 valueOf()的优先级高于 toString()，这里需要注意的是当调用 valueOf()方法无法运算后还是会再调用 toString()方法

[valueOf 和 toString 的区别](https://www.cnblogs.com/diantao/p/6214203.html)

### 使用 js 实现一个持续的动画效果

#### setTimeout

```js
setTimeout(function foo() {
  e.style.left += 2;
  setTimeout(foo, 1000 / 60);
}, 0);
```

#### setInterval

```js
setInterval(() => {
  e.style.left += 2;
}, 1000 / 60);
```

#### requestAnimationFrame

```js
(function animloop() {
  e.style.left += 2;
  requestAnimFrame(animloop);
})();
```

### 封装一个函数，参数是定时器的时间，`.then`执行回调

```js
function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
```

### 数组去重
```js
function dedupe(arr) {
    return [...new Set(arr)]
}
```

### 判断两个对象相等

使用`JSON.stringify`来快速判断

```js
JSON.stringify(obj) == JSON.stringify(obj2);
```

### 只使用 promise，实现循环中串行执行

```js
(function loop(i) {
  if (i < 10)
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(i);
        resolve();
      }, Math.random() * 1000);
    }).then(loop.bind(null, i + 1));
})(0);
```

### 描述对象属性行为的特性

Object 的属性有 4 个描述行为的特性：

- Configurable：表示能否通过 delete 删除属性从而重新定义属性
- Enumerable：表示能否通过 for-in 循环返回属性
- writable：表示能否修改属性的值
- Value：表示这个属性的值

以上四个属性在不显示调用 Object.defineProperty()的时候，前三个默认值都为 true，而 value 为你自己设定的值，如果不设定的话则为 undefined。

### bind 多次调用

bind 函数可以通过以下代码模拟：

```js
Function.prototype.bind = function(that) {
  var _this = this,
    slice = Array.prototype.slice,
    args = slice.call(arguments, 1);
  return function() {
    return _this.apply(that, args.concat(slice.call(arguments, 0)));
  };
};
```

当 bind 被多次调用时，只有第一次调用生效。

```js
function foo() {
  return this.bar;
}
foo = foo.bind({ bar: 1 }).bind({ bar: 2 });
foo(); // 1
```

要想使以上代码最后输出 2 ，需要经过以下改造

```js
var functionPrototypeBind = Function.prototype.bind;
Function.prototype.bind = function bind() {
  var fn = typeof this.__bind__ === "function" ? this.__bind__ : this;
  var bindfn = functionPrototypeBind.apply(fn, arguments);
  Object.defineProperty(bindfn, "__bind__", { value: fn });
  return bindfn;
};
```

### new 操作符的工作原理

```js
var F = function() {};
var p = new F();
```

1. 新建一个对象`var instance = new Object()`
2. 设置原型链`instance.__proto__ = F.prototype`
3. 让 F 中的 this 指向 instance，并执行 F 的函数体`F.call(instance)`
4. 判断 F 的返回值类型：如果是值类型，就丢弃它，还是返回 instance；如果是引用类型，就返回这个引用类型的对象，替换掉 instance

> 如果没有写 return，相当于`return undefined`(JavaScript 中的函数都是如此)。undefined 是值类型的，因此返回 instance。

### 浮点数计算不准确问题

产生原因：某些数字（比如 0.1 和 0.2）转化为二进制之后，变成了一个无限循环的数字，对于无限循环的小数，计算机会进行舍入处理，因此计算时产生了误差。

解决方法：把要计算的数字升级（乘以 10 的 n 次幂）成计算机能够精确识别的整数，计算完以后再降级。

### this 指向
```js
var num = 1;
let obj = {
    num: 2,
    add: function() {
        this.num = 3;
        // 这里的立即指向函数，因为我们没有手动去指定它的this指向，所以都会指向window
        (function() {
            // 所有这个 this.num 就等于 window.num（严格模式下输出 undefined）
            console.log(this.num);
            this.num = 4;
        })();
        console.log(this.num);
    },
    sub: function() {
        console.log(this.num)
    }
}
/**
 * 在通过obj.add 调用add 函数时，函数的this指向的是obj,这时候第一个this.num=3
 * 相当于 obj.num = 3 但是里面的立即指向函数this依然是window,
 * 所以 立即执行函数里面console.log(this.num)输出1，同时 window.num = 4
 *立即执行函数之后，再输出`this.num`,这时候`this`是`obj`,所以输出3
 */
obj.add() // 输出 1 3

// 通过上面`obj.add`的执行，obj.name 已经变成了3
console.log(obj.num) // 输出3
// 这个num是 window.num
console.log(num) // 输出4（严格模式下输出 1）
// 如果将obj.sub 赋值给一个新的变量，那么这个函数的作用域将会变成新变量的作用域
const sub = obj.sub
// 作用域变成了window window.num 是 4
sub() // 输出4
```

* 作为普通函数调用：严格模式下，this的值是 undefined，非严格模式下，this指向全局对象。
* 作为方法调用：this指向所属对象。
* 作为构造函数调用：this指向实例化的对象。
* 通过call, apply, bind调用：如果指定了第一个参数thisArg，this的值就是thisArg的值（如果是原始值，会包装为对象）；如果不传thisArg，要判断严格模式，严格模式下this是undefined，非严格模式下this指向全局对象。

