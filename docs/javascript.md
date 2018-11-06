### 使用js实现一个持续的动画效果

#### setTimeout
```js
setTimeout(function foo () {
  e.style.left += 2
  setTimeout(foo, 1000 / 60)
}, 0)
```

#### setTimeout
```js
setInterval(() => {
  e.style.left += 2
}, 1000 / 60)
```

#### requestAnimationFrame
```js
(function animloop() {
  e.style.left += 2
  requestAnimFrame(animloop);
})();
```
