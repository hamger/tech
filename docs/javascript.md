### 函数节流（throttle）与函数去抖（debounce）

设定一个执行周期 T

```js
const T = 1000;
```

#### 函数节流

节流：如果将水龙头拧紧直到水是以水滴的形式流出，那你会发现每隔一段时间，就会有一滴水流出。

当前后调用的时间间隔小于 T 则不执行该动作，反之则执行。

```js
var throttle = function(delay, action) {
  var last = Date.now(),
    first = true;
  return function() {
    var curr = Date.now();
    if (first) {
      // 第一次必定执行
      action.apply(this, arguments);
      first = false;
    } else if (curr - last > delay) {
      action.apply(this, arguments);
      last = curr;
    }
  };
};
```

#### 函数去抖

去抖：如果用手指一直按住一个弹簧，它将不会弹起直到你松手为止。

当前后调用的时间间隔小于 T 则覆盖前一次调用，重新计算执行时间。

```js
var debounce = function(idle, action) {
  var timer;
  return function() {
    var ctx = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() {
      action.apply(ctx, args);
    }, idle);
  };
};
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
  num = num.toString().split(".");
  var arr = num[0].split("").reverse();
  var res = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    if (i % 3 === 0 && i !== 0) res.push(",");
    res.push(arr[i]);
  }
  var integer = res.reverse().join("");
  return num[1] ? integer + "." + num[1] : integer;
}
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

### [数组去重](https://hamger.github.io/2017/03/11/JS%E6%95%B0%E7%BB%84%E5%8E%BB%E9%87%8D/)

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
