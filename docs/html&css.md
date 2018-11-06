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

参见[这里](https://hamger.github.io/2018/03/15/%E5%AE%9E%E7%8E%B0%E4%B8%A4%E6%A0%8F%E5%B8%83%E5%B1%80/)

### 水平垂直居中

参见[这里](https://hamger.github.io/2017/03/09/div%E5%B1%85%E4%B8%AD/)