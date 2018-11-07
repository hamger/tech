### 使用 css 实现一个持续的动画效果

```css
#demo {
  animation: mymove 5s infinite;
}

@keyframes mymove {
  0% {
    top: 0px;
  }
  50% {
    top: 100px;
  }
  100% {
    top: 0px;
  }
}
```

> animation 的用法

| key                       | description                            |
| ------------------------- | -------------------------------------- |
| animation-name            | 规定需要绑定到选择器的 keyframe 名称   |
| animation-duration        | 规定完成动画所花费的时间，以秒或毫秒计 |
| animation-timing-function | 规定动画的速度曲线                     |
| animation-delay           | 规定在动画开始之前的延迟               |
| animation-iteration-count | 规定动画应该播放的次数                 |
| animation-direction       | 规定是否应该轮流反向播放动画           |

### 左边固定，右边自适应

```html
<div class="wrapper">
  <div class="left"></div>
  <div class="right"></div>
</div>
```

利用浮动和绝对定位元素脱离文档流的特性。

```css
.wrapper {
  overflow: hidden; // 清除浮动
}
.left {
  float: left; // 也可以是 position: absolute;
}
.right {
  margin-left: 140px;
}
```

[更多](https://hamger.github.io/2018/03/15/%E5%AE%9E%E7%8E%B0%E4%B8%A4%E6%A0%8F%E5%B8%83%E5%B1%80/)

### 水平垂直居中

```css
.container {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}
.container div {
  width: 100px;
  height: 100px;
  background-color: pink;
}
```

[更多](https://hamger.github.io/2017/03/09/div%E5%B1%85%E4%B8%AD/)

### CSS Module 了解多少

CSS Modules 既不是官方标准，也不是浏览器的特性，而是在构建步骤（例如使用 Webpack 或 Browserify）中对 CSS 类名和选择器限定作用域的一种方式（类似于命名空间）。
CSS Modules 只加入了局部作用域和模块依赖。
CSS 的规则都是全局的，任何一个组件的样式规则，都对整个页面有效。CSS Modules 实现局部作用域的方法是使用一个独一无二的 class 的名字，不会与其他选择器重名，避免影响其他的样式。从此不在需要遵循[BEM 规范](https://css-tricks.com/bem-101/)。

[更多](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)

### 模块化开发是怎么做的

使用命名空间。