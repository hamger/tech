### 使用 css 实现一个持续的动画效果

```css
#demo {
  animation: mymove 5s infinite;
}

@keyframes mymove {
  0% {top: 0px;}
  50% {top: 100px;}
  100% {top: 0px;}
}
```
> animation 的用法

key | description
-- | --
animation-name |	规定需要绑定到选择器的 keyframe 名称
animation-duration	| 规定完成动画所花费的时间，以秒或毫秒计
animation-timing-function	| 规定动画的速度曲线
animation-delay |	规定在动画开始之前的延迟
animation-iteration-count	| 规定动画应该播放的次数
animation-direction	| 规定是否应该轮流反向播放动画
