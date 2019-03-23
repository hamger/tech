### vue-router 跳转和 location.href 有什么区别

vue-router 是 hash 改变，不刷新页面
location.href 是页面跳转，刷新页面

### dom 解析

chrome 浏览器首先会请求 HTML 文档，然后对其中的各种资源调用相应的资源加载器进行异步网络请求，同时进行 DOM 渲染，直到遇到`<script>`标签的时候，主进程才会停止渲染，等待此资源加载完毕后调用 V8 引擎对 js 解析，继而继续进行 DOM 解析。

浏览器是解析 DOM 生成 `DOM Tree`，结合 CSS 生成的 `CSS Tree`，最终组成 `render Tree`，再渲染页面。由此可见，在此过程中 CSS 完全无法影响 `DOM Tree`，因而无需阻塞 DOM 解析，CSS 会阻塞 `render tree` 的生成。js 需要在 css 后加载，因为脚本的内容可能是获取元素的样式，这依赖于 CSS 。

JS 会阻塞 DOM 解析，原因是，浏览器并不知道脚本的内容是什么，如果先行解析下面的 DOM ，万一脚本内全删了后面的 DOM，浏览器就白干了。这导致了 CSS 变相阻塞了 DOM 解析，因为 js 需要在 css 后加载。

#### 优化

如果 JS 文件体积太大，同时你确定没必要阻塞 DOM 解析的话，不妨按需要加上 defer（立即下载，但延迟到整个页面都解析完毕后再执行）或者 async （不让页面等待该脚本下载和执行，从而异步加载页面其他内容）属性，此时脚本下载的过程中是不会阻塞 DOM 解析的。另外也可以拆分大文件，不用立即执行的代码，可以使用`setTimeout()`进行延迟处理。

> async 是乱序的，defer 是顺序执行，async 就相当于单独开了一个进程去独立加载和执行，而 defer 相当于将`<script>`放到`<body>`底部

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

- 动画效果应用到 position 属性为 absolute 或 fixed 的元素上(绝对定位脱离文档流，避免引起父元素及后续元素的回流)

### 垃圾回收机制（Garbage Collection）

现在各大浏览器通常用采用的垃圾回收有两种方法：标记清除、引用计数。

1、标记清除

这是 javascript 中最常用的垃圾回收方式。当变量进入执行环境是，就标记这个变量为“进入环境”。从逻辑上讲，永远不能释放进入环境的变量所占用的内存，因为只要执行流进入相应的环境，就可能会用到他们。当变量离开环境时，则将其标记为“离开环境”。垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记。然后，它会去掉环境中的变量以及被环境中的变量引用的标记。而在此之后再被加上标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。最后。垃圾收集器完成内存清除工作，销毁那些带标记的值，并回收他们所占用的内存空间。

2、引用计数

另一种不太常见的垃圾回收策略是引用计数。引用计数的含义是跟踪记录每个值被引用的次数。当声明了一个变量并将一个引用类型赋值给该变量时，则这个值的引用次数就是 1。相反，如果包含对这个值引用的变量又取得了另外一个值，则这个值的引用次数就减 1。当这个引用次数变成 0 时，则说明没有办法再访问这个值了，因而就可以将其所占的内存空间给收回来。这样，垃圾收集器下次再运行时，它就会释放那些引用次数为 0 的值所占的内存。

[JavaScript 垃圾回收机制](https://www.cnblogs.com/zhwl/p/4664604.html)

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

[js十大排序算法详解](https://www.cnblogs.com/liyongshuai/p/7197962.html)

### cookie 与 session

- Cookie 是将用户的数据存储到**客户端**的技术
- Session 是将数据存储在**服务端**的技术，会为每个客户端都创建一块内存空间，存储客户的数据，但客户端需要每次都携带一个标识 ID 去服务器中寻找属于自己的内存空间。所以 Session 的实现是基于 Cookie ，Session 需要借助于 Cookie 存储客户的唯一标识 session ID

[Cookie 与 session 的区别及其常见面试问题](https://blog.csdn.net/weixin_40521823/article/details/79837162)

### token

在客户数量比较大的情况下，使用 Session 做身份验证会有内存空间不足的隐患，使用 token 机制的身份验证方法，在服务器端不需要存储用户的登录记录。

客户端使用用户名和密码请求登录。服务端收到请求，验证用户名和密码。验证成功后，服务端会生成一个 token，然后把这个 token 发送给客户端。客户端收到 token 后把它存储起来，可以放在 cookie 或者 Local Storage（本地存储）里。客户端每次向服务端发送请求的时候都需要带上服务端发给的 token。服务端收到请求，然后去验证客户端请求里面带着 token，如果验证成功，就向客户端返回请求的数据。
生成和验证 token 的过程涉及到了加密和解密，所以是一种以时间换取空间的做法。

[基于 Token 的身份验证：JWT(JSON Web Token)](https://ninghao.net/blog/2834)

### devDependencies、dependencies、peerDependencies

- dependencies 生产环境下依赖的模块，不仅开发环境能使用，生产环境也能使用
- devDependencies 开发环境下依赖的模块，只在开发环境能使用
- peerDependencies 指定所需要兼容的宿主包的版本，[detail](https://xwenliang.cn/p/5af2a97d5a8a996548000003)

比如我们发布了一个名字叫做 webpack-plugin-a 的插件，他只是 webpack 的一个插件，并不依赖 webpack，所以不会把 webpack 写入自身的 dependencies 或者 devDependencies，但是它又确实需要针对特定版本的 webpack 来进行开发，这时可以使用 peerDependencies 指定 webpack 的版本：

```js
"peerDependencies": {
    "webpack": "^2.0.0"
}
```

### 浏览器缓存规则

HTTP 缓存有多种规则，根据是否需要重新向服务器发起请求来分类，我将其分为两大类：强制缓存，协商缓存（也叫对比缓存）。
对于强缓存，浏览器在第一次请求的时候，会直接下载资源，然后缓存在本地，第二次请求的时候，直接使用缓存，不发起 http 请求。
对于协商缓存，第一次请求保存资源标识与时间，第二次请求向服务器发送资源标识和最后缓存时间，服务端进行校验，如果失效则返回 200 和新的资源，如果资源没有变更则返回 304 。

强缓存方案：

- Exprires：属于 HTTP 1.0 的内容，表示服务端返回的到期时间，缺陷是在服务端和客户端时间不同步的情况下会导致缓存命中误差。

- Cache-control：常见的取值有 private、public、no-cache、max-age，no-store，默认为 private。

```
private:         客户端可以缓存
public:          客户端和代理服务器都可以缓存
max-age=xxx:     缓存的内容将在 xxx 秒后失效
no-cache:        需要使用对比缓存来验证缓存数据
no-store:        所有内容都不会缓存，强制缓存和对比缓存都不会触发
```

协商缓存方案：

- Last-modified / If-Modified-Since：都是表示时间的字符串，响应头中带 Last-modified 表明资源的修改时间，第二次请求的时候客户端带上请求头 If-Modified-Since ，表示资源上次的修改时间，服务端进行对比。

- ETag / If-None-Match：都是一个标识字符串，优先级高于 Last-Modified / If-Modified-Since，第一次请求的时候，服务端会返回 ETag 标识给客户端，第二次请求的时候客户端请求头带上 If-None-Match 标识，服务端进行对比。

[HTTP 缓存机制详解](https://juejin.im/entry/599afbe5f265da247c4ee6e3)

### 事件循环

异步任务分为 task（宏任务，也可称为 macroTask ）和 microtask（微任务）两类。

- macroTask: `requestAnimationFrame`、`setTimeout`、`setInterval`、UI render、 NodeJS 中的`I/O`。
- microTask: `promise`、`Object.observe`、`MutationObserver`、NodeJs 中的`process.nextTick`。

浏览器中事件循环的顺序：

1. 执行完主执行线程中的任务。
2. 取出 Microtask Queue 中任务执行直到清空。
3. 取出 Macrotask Queue 中**一个**任务执行。
4. 取出 Microtask Queue 中任务执行直到清空。
5. 重复 3 和 4。

```js
while (true) {
  宏任务队列.shift();
  微任务队列全部任务();
}
```

node 环境下的执行顺序：

```js
while (true) {
  loop.forEach(阶段 => {
    阶段全部任务();
    nextTick全部任务();
    microTask全部任务();
  });
  loop = loop.next;
}
```

[浏览器和 Node 不同的事件循环](https://segmentfault.com/a/1190000013660033?utm_source=channel-hottest)
