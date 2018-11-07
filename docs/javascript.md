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
