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
    if (first) { // 第一次必定执行
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

```js
function a(num) {
  var arr = String(num).split("."),
    reg = /(?=(\B\d{3})+$)/g,
    integer = arr[0].replace(reg, ",");
  return arr[1] ? integer + "." + arr[1] : integer;
}
```

### valueOf 和 toString

基本上所有的JavaScript数据类型都有valueOf()，toString()方法，null除外，这两个方法解决了JavaScript值运算和显示的问题。

* valueOf() 会把数据类型转换成原始类型
* toString() 会把数据类型转换成 string 类型
 
这两个方法有意思的地方在于什么时候使用，总结如下：
1、valueOf()偏向于运算，toString()偏向于显示
2、对象转换时，优先调用toString()
3、强转字符串的情况下，优先调用toString()方法；强转数字的情况下优先调用valueOf()
4、正常情况下，优先调用toString()
5、在有运算操作符的情况下valueOf()的优先级高于toString()，这里需要注意的是当调用valueOf()方法无法运算后还是会再调用toString()方法

[more](https://www.cnblogs.com/diantao/p/6214203.html)

### 

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

### Set 和 Map 数据结构

Set 类似于数组，但是成员的值都是唯一的，没有重复的值。
Map 类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。

> WeakSet
> WeakSet 结构与 Set 类似，区别：WeakSet 的成员只能是对象，WeakSet 中的对象都是弱引用（垃圾回收机制不考虑 WeakSet 对该对象的引用），WeakSet 不可遍历。

> WeakMap

WeakMap 结构与 Map 类似，区别：WeakMap 只接受对象作为键名（ null 除外），而且键名所指向的对象，不计入垃圾回收机制。
WeakMap 支持 set(key, value) 、get(key)、has(key)、delete(key)，但不支持 clear() 方法，且不可遍历。

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
