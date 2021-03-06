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

### 清除浮动

```css
.clearfix:after {
  clear: both;
  content: "."; // 也可以为空
  display: block;
  width: 0;
  height: 0;
  visibility: hidden;
}
.clearfix {
  zoom: 1;
}
```

[更多](https://hamger.github.io/2017/03/12/%E6%B8%85%E9%99%A4%E6%B5%AE%E5%8A%A8/)

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

### CSS Module 了解多少

CSS Modules 既不是官方标准，也不是浏览器的特性，而是在构建步骤（例如使用 Webpack 或 Browserify）中对 CSS 类名和选择器限定作用域的一种方式（类似于命名空间）。
CSS Modules 只加入了局部作用域和模块依赖。
CSS 的规则都是全局的，任何一个组件的样式规则，都对整个页面有效。CSS Modules 实现局部作用域的方法是使用一个独一无二的 class 的名字，不会与其他选择器重名，避免影响其他的样式。从此不在需要遵循[BEM 规范](https://css-tricks.com/bem-101/)。

[CSS Modules 用法教程](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)

### css 实现箭头

#### 实心箭头

例如实现一个向上的实心箭头，就是把上、左、右三条边隐藏掉（颜色设为 transparent），把先边框显示出来。

```css
#demo {
  width: 0;
  height: 0;
  border-width: 20px;
  border-style: solid;
  border-color: transparent transparent red transparent;
}
```

#### 空心箭头

例如实现一个向右的空心箭头，就是把上、左边隐藏掉（border 粗细设为 0），把下、右边框显示出来，然后逆时针旋转 45 度。

```css
#demo {
  width: 20px;
  height: 20px;
  border-top: 0px solid red;
  border-left: 0px solid red;
  border-bottom: 1px solid red;
  border-right: 1px solid red;
  background-color: transparent;
  transform: rotate(-45deg);
}
```

### 浏览器如何优化 css 动画

- 使用与 requestAnimationFrame 类似的机制，把每一帧中的所有 DOM 操作集中起来，在一次重绘或回流中就完成
- 强制使用硬件加速 （通过 GPU 来提高动画性能）
- CSS 动画只改变部分属性（backface-visibility、opacity、perspective、perspective-origin、transfrom）时，动画会在 compositor thread 完成

> 渲染线程分为 main thread (主线程) 和 compositor thread (合成器线程)。

### 1px 问题

1px 变粗的原因就在于一刀切的设置 viewport 宽度, 如果能把 viewport 宽度设置为实际的设备物理宽度, css 里的 1px 就等于实际 1px 了。 flexible.js 就是这样干的。

另一个思路是使用媒体查询，对不同的`-webkit-min-device-pixel-ratio`下的 border 进行区别处理：

- (1 / n) px
- tranform + 伪元素
- 利用阴影(box-shadow)来模拟边框
- 利用图片(border-image)来模拟边框

[1px 边框解决方案总结](https://juejin.im/post/5af136b8f265da0b7a20a40e#heading-2)


### 自定义元素的属性
以前自定义元素的属性要通过`user-defined-attribute="value"`的方式来设置自己需要的属性：
```html
<div id="myDiv" user-defined-attribute="value">在标签里设置自定义属性</div>
```
使用`getAttribute`来获取自定义属性的值：
```js
document.getElementById("myDiv").getAttribute("user-defined-attribute")
```

现在H5为我们提供了一个data属性 **"data-"** 作为前缀，可以让所有的HTML元素都支持自定义的属性。
```html
<div id="myDiv" data-attribute="value">在标签里设置H5新增的自定义属性</div>
```
获取自定义属性（使用H5自定义属性对象Dataset来获取）
```js
var myDiv = document.getElementById("myDiv");
var theValue = myDiv.dataset;    //DOMStringMap对象
console.log(theValue.attribute);
```
