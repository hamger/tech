### 项目性能优化

- 减少 HTTP 请求数
- 权衡减少 DNS 查询 和 多域名提供资源
- 使用 CDN（加速、安全）
- 图片懒加载
- 减少 DOM 元素数量 和 DOM 操作
- 压缩 JavaScript 、 CSS 、字体、图片等
- 避免图片 src 为空（出现一次`<img src="" />`会导致多一次请求）
- 样式表放在头部，脚本放在页面底部
- 避免使用 iframe

> iframe 缺点

- iframe 会阻塞主页面的 Onload 事件；
- 搜索引擎的检索程序无法解读这种页面，不利于 SEO;
- iframe 框架页面会增加服务器的 http 请求

### vue-router 跳转和 location.href 有什么区别

vue-router 是 hash 改变，不刷新页面
location.href 是页面跳转，刷新页面

### 重排(回流)和重绘

- 重排（reflow）：由于节点几何属性（比如宽高）发生改变，渲染树需要重新分析并计算节点尺寸。
- 重绘（repaint）：由于节点非几何属性（比如颜色）发生改变，屏幕上的部分内容需要更新。

> 最小化重排和重绘

- 不要逐个变样式。

  - 改变类名而不是样式
  - 或统一用 cssText 编辑

- “离线”的批量改变和表现 DOM。
  - 通过 documentFragment 来保留临时变动
  - 通过 display:none 属性隐藏元素（一次重排重绘），添加足够多的变更后，通过 display 属性显示（另一次重排重绘）
  - 不频繁计算样式。通过将样式缓存在一个变量中进行计算，最后赋值给样式

### 垃圾回收机制（Garbage Collection）

现在各大浏览器通常用采用的垃圾回收有两种方法：标记清除、引用计数。

1、标记清除

这是 javascript 中最常用的垃圾回收方式。当变量进入执行环境是，就标记这个变量为“进入环境”。从逻辑上讲，永远不能释放进入环境的变量所占用的内存，因为只要执行流进入相应的环境，就可能会用到他们。当变量离开环境时，则将其标记为“离开环境”。垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记。然后，它会去掉环境中的变量以及被环境中的变量引用的标记。而在此之后再被加上标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。最后。垃圾收集器完成内存清除工作，销毁那些带标记的值，并回收他们所占用的内存空间。

2、引用计数

另一种不太常见的垃圾回收策略是引用计数。引用计数的含义是跟踪记录每个值被引用的次数。当声明了一个变量并将一个引用类型赋值给该变量时，则这个值的引用次数就是 1。相反，如果包含对这个值引用的变量又取得了另外一个值，则这个值的引用次数就减 1。当这个引用次数变成 0 时，则说明没有办法再访问这个值了，因而就可以将其所占的内存空间给收回来。这样，垃圾收集器下次再运行时，它就会释放那些引用次数为 0 的值所占的内存。

[more](https://www.cnblogs.com/zhwl/p/4664604.html)

### http 与 https 的区别

- https 协议需要到 ca 申请证书，一般免费证书较少，因而需要一定费用。

- http 是超文本传输协议，信息是明文传输，https 则是具有安全性的 SSL（Secure Sockets Layer） 加密传输协议。

- http 和 https 使用的是完全不同的连接方式，用的端口也不一样，前者是 80，后者是 443。

- http 的连接很简单，是无状态的；HTTPS 协议是由 SSL + HTTP 协议构建的可进行加密传输、身份认证的网络协议，比 http 协议安全。

### 冒泡排序

```js
var examplearr = [8, 94, 15, 88, 55, 76, 21, 39];
function sortarr(arr) {
  for (i = 0; i < arr.length - 1; i++) {
    for (j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}
console.log(sortarr(examplearr));
```

第一轮排序（i=0）从 j=0 执行到 j=6，将最大的数排到了最后；
第二轮排序（i=1），由于最大的数已经在最后了，没有必要去比较数组的最后两项，所以有`j < arr.length - 1 - i`；
以此类推，每次将剩下数组里面最大的一个数排到最后面，最后一轮排序（i=6），只需要比较数组的第一和第二项。

[其他排序](https://www.cnblogs.com/liyongshuai/p/7197962.html)

### 双向绑定

```js
<input v-model="something">
```

以上代码其实是以下代码的语法糖：

```js
<input v-bind:value="something" v-on:input="something = $event.target.value">
```

### cookie 与 session

- Cookie 是将用户的数据存储到**客户端**的技术
- Session 是将数据存储在**服务端**的技术，会为每个客户端都创建一块内存空间，存储客户的数据，但客户端需要每次都携带一个标识 ID 去服务器中寻找属于自己的内存空间。所以 Session 的实现是基于 Cookie ，Session 需要借助于 Cookie 存储客户的唯一标识 session ID

[more](https://blog.csdn.net/weixin_40521823/article/details/79837162)

### token

在客户数量比较大的情况下，使用 Session 做身份验证会有内存空间不足的隐患，使用 token 机制的身份验证方法，在服务器端不需要存储用户的登录记录。

客户端使用用户名和密码请求登录。服务端收到请求，验证用户名和密码。验证成功后，服务端会生成一个 token，然后把这个 token 发送给客户端。客户端收到 token 后把它存储起来，可以放在 cookie 或者 Local Storage（本地存储）里。客户端每次向服务端发送请求的时候都需要带上服务端发给的 token。服务端收到请求，然后去验证客户端请求里面带着 token，如果验证成功，就向客户端返回请求的数据。
生成和验证 token 的过程涉及到了加密和解密，所以是一种以时间换取空间的做法。

[基于 Token 的身份验证：JWT(JSON Web Token)](https://ninghao.net/blog/2834)

### devDependencies&、dependencies、peerDependencies

* dependencies 生产环境下依赖的模块，不仅开发环境能使用，生产环境也能使用
* devDependencies 开发环境下依赖的模块，只在开发环境能使用
* peerDependencies 指定所需要兼容的宿主包的版本，[detail](https://xwenliang.cn/p/5af2a97d5a8a996548000003)

