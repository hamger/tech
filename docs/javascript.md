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

[JS 数组去重](https://hamger.github.io/2017/03/11/JS%E6%95%B0%E7%BB%84%E5%8E%BB%E9%87%8D/)

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
