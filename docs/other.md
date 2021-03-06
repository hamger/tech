### 重排(回流)和重绘

* 重排（reflow）：由于节点几何属性（比如宽高）发生改变，渲染树需要重新分析并计算节点尺寸。
* 重绘（repaint）：由于节点非几何属性（比如颜色）发生改变，屏幕上的部分内容需要更新。

> 最小化重排和重绘

* 不要逐个变样式。

  + 改变类名而不是样式
  + 或统一用 cssText 编辑

* “离线”的批量改变和表现 DOM。

  + 通过 documentFragment 来保留临时变动
  + 通过 display:none 属性隐藏元素（一次重排重绘），添加足够多的变更后，通过 display 属性显示（另一次重排重绘）
  + 不频繁计算样式。通过将样式缓存在一个变量中进行计算，最后赋值给样式

* 动画效果应用到 position 属性为 absolute 或 fixed 的元素上(绝对定位脱离文档流，避免引起父元素及后续元素的回流)

### 浏览器渲染阻塞

现代浏览器总是**并行加载**资源。例如，当 HTML 解析器被脚本阻塞时，解析器虽然会停止构建 DOM，但仍会识别该脚本后面的资源，并进行**预加载**。

* CSS 被视为阻塞渲染的资源，这意味着浏览器将不会渲染任何已处理的内容，直至 CSSOM 构建完毕。
* JavaScript 不仅可以读取和修改 DOM 属性，还可以读取和修改 CSSOM 属性。
* 当浏览器遇到一个 script 标记时，DOM 构建将暂停，直至脚本完成执行。
* CSSOM 构建时，JavaScript 执行将暂停，直至 CSSOM 就绪。

> 如果 JS 文件体积太大，同时你确定没必要阻塞 DOM 解析的话，不妨按需要加上 defer（立即下载，但延迟到整个页面都解析完毕后再执行）或者 async （不让页面等待该脚本下载和执行，从而异步加载页面其他内容）属性，此时脚本下载的过程中不会阻塞 DOM 解析。另外也可以拆分大文件，不用立即执行的代码，可以使用 `setTimeout()` 进行延迟处理。

> async 是乱序的，defer 是顺序执行，async 就相当于单独开了一个进程去独立加载和执行，而 defer 相当于将 `<script>` 放到 `<body>` 底部。注意 async 与 defer 属性对于 inline-script 都是无效的，只针对设置了 src 属性的 script 标签。

### 垃圾回收机制（Garbage Collection）

现在各大浏览器通常用采用的垃圾回收有两种方法：标记清除、引用计数。

1、标记清除

这是 javascript 中最常用的垃圾回收方式。当变量进入执行环境是，就标记这个变量为“进入环境”。从逻辑上讲，永远不能释放进入环境的变量所占用的内存，因为只要执行流进入相应的环境，就可能会用到他们。当变量离开环境时，则将其标记为“离开环境”。垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记。然后，它会去掉环境中的变量以及被环境中的变量引用的标记。而在此之后再被加上标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。最后。垃圾收集器完成内存清除工作，销毁那些带标记的值，并回收他们所占用的内存空间。

2、引用计数

另一种不太常见的垃圾回收策略是引用计数。引用计数的含义是跟踪记录每个值被引用的次数。当声明了一个变量并将一个引用类型赋值给该变量时，则这个值的引用次数就是 1。相反，如果包含对这个值引用的变量又取得了另外一个值，则这个值的引用次数就减 1。当这个引用次数变成 0 时，则说明没有办法再访问这个值了，因而就可以将其所占的内存空间给收回来。这样，垃圾收集器下次再运行时，它就会释放那些引用次数为 0 的值所占的内存。

[JavaScript 垃圾回收机制](https://www.cnblogs.com/zhwl/p/4664604.html)

### cookie 与 session

* Cookie 是将用户的数据存储到**客户端**的技术
* Session 是将数据存储在**服务端**的技术，会为每个客户端都创建一块内存空间，存储客户的数据，但客户端需要每次都携带一个标识 ID 去服务器中寻找属于自己的内存空间。所以 Session 的实现是基于 Cookie ，Session 需要借助于 Cookie 存储客户的唯一标识 session ID

[Cookie 与 session 的区别及其常见面试问题](https://blog.csdn.net/weixin_40521823/article/details/79837162)

### token

在客户数量比较大的情况下，使用 Session 做身份验证会有内存空间不足的隐患，使用 token 机制的身份验证方法，在服务器端不需要存储用户的登录记录。

客户端使用用户名和密码请求登录。服务端收到请求，验证用户名和密码。验证成功后，服务端会生成一个 token，然后把这个 token 发送给客户端。客户端收到 token 后把它存储起来，可以放在 cookie 或者 Local Storage（本地存储）里。客户端每次向服务端发送请求的时候都需要带上服务端发给的 token。服务端收到请求，然后去验证客户端请求里面带着 token，如果验证成功，就向客户端返回请求的数据。
生成和验证 token 的过程涉及到了加密和解密，所以是一种以时间换取空间的做法。

[基于 Token 的身份验证：JWT(JSON Web Token)](https://ninghao.net/blog/2834)

### devDependencies、dependencies、peerDependencies

* dependencies 生产环境下依赖的模块，不仅开发环境能使用，生产环境也能使用
* devDependencies 开发环境下依赖的模块，只在开发环境能使用
* peerDependencies 指定所需要兼容的宿主包的版本，[detail](https://xwenliang.cn/p/5af2a97d5a8a996548000003)

比如我们发布了一个名字叫做 webpack-plugin-a 的插件，他只是 webpack 的一个插件，并不依赖 webpack，所以不会把 webpack 写入自身的 dependencies 或者 devDependencies，但是使用这个插件的项目需要安装指定版本的 webpack ，这时可以使用 peerDependencies 指定 webpack 的版本：

``` js
"peerDependencies": {
    "webpack": "^2.0.0"
}
```

### 事件循环

异步任务分为 task（宏任务，也可称为 macroTask ）和 microtask（微任务）两类。

* macroTask: `script(整体代码)`、`requestAnimationFrame`、`setTimeout`、`setInterval`、 `postMessage`、`async` 函数未完成的部分、UI render、 NodeJS 中的`I/O`。
* microTask: `promise`、`Object.observe`、`MutationObserver`、NodeJs 中的`process.nextTick`。

> setTimeout / setInterval 要放到**宏任务队列的末尾**

浏览器中事件循环的顺序：

1. 执行完主执行线程中的同步代码。
2. 取出微任务队列中任务执行直到清空。
3. 取出宏任务队列中**一个**任务执行。
4. 取出微任务队列中任务执行直到清空。
5. 重复 3 和 4。

``` js
while (true) {
    宏任务队列.shift();
    微任务队列全部任务();
}
```

> 在 node 11 版本中，node 下 Event Loop 已经与浏览器趋于相同。

#### 例子一

``` js
function foo() {
    console.error("foo");
    Promise.resolve().then(foo);
}
foo();

function bar() {
    console.error("bar");
    setTimeout(bar);
}
bar();

// foo
// bar
// 之后都是 foo
```

> 关于 setTimeout 要补充的是，即便主线程为空，0 毫秒实际上也是达不到的。根据 HTML 的标准，最低是 4 毫秒。

#### 例子二

``` js
var p = new Promise((resolve, reject) => {
    resolve("hello_6");
    console.log("1");
});

function hello() {
    console.log("hello_begins_2");
    return p;
}

hello()
    .then((res) => {
        console.log(res);
        console.log("hello_7");
        return "hello_10";
    })
    .then((res) => {
        console.log(res);
        console.log("hello_11");
        return "hello_13";
    })
    .then((res) => {
        console.log(res);
        console.log("hello_14");
    });

function test1() {
    console.log("test1_5");
}

async function asy() {
    console.log("asy_begins_3");
    await console.log("asy_4");

    console.log("async_8");
    await console.log("asy_9");

    console.log("asy_ends_12");
}

asy();
test1();
```

> **任务是分层的 **。await 后面的代码虽然算作宏任务，但是和普通的微任务不在一个维度，位于更上一层的任务队列，所以优先度要比其他（下层）微任务要高；

[详细解释](https://www.cnblogs.com/AhuntSun-blog/p/13584169.html)

### 常见的编程范式

* 命令式编程(过程化编程): 更关心解决问题的步骤，一步步以语言的形式告诉计算机做什么
* 事件驱动编程: 事件订阅与触发，被广泛用于 GUI 的编程设计中
* 面向对象编程: 基于类、对象与方法的设计模式，拥有三个基础概念: 封装性、继承性、多态性
* 函数式编程: 将运算最大限度地转化为一系列**纯函数**的调用

> 纯函数：不依赖外部变量，不修改外部变量，在任何时候传入相同参数，得到相同结果。

> 函数是"第一等公民"：函数可以赋值给其他变量，也可以作为参数传入另一个函数，或者作为别的函数的返回值。

> 函数式编程好处：代码简洁；接近自然语言；无副作用。

> 函数式编程应用：柯里化（curry）、组合 (compose)

### 设计原则

* 单一职责原则（Single Responsibility Principle，简称SRP ）：一个类只有一个职责。
* 里氏替换原则（Liskov Substitution Principle,简称LSP）：所有引用基类的地方必须能使用其子类的对象。
* 依赖倒置原则（Dependence Inversion Principle,简称DIP）：高层模块不应该依赖底层模块，二者都该依赖其抽象；抽象不应该依赖细节；细节应该依赖抽象。
* 接口隔离原则（Interface Segregation Principle,简称ISP）： 类间的依赖关系应该建立在最小的接口上。
* 迪米特法则（Law of Demeter,简称LoD）：一个对象应该对其他对象有最少的了解，又叫做最少知识原则，意义在于降低类之间的耦合。
* 开放封闭原则（Open Close Principle,简称OCP）：尽量通过扩展软件实体来解决需求变化，而不是通过修改已有的代码来完成变化。

### 前端模块化

#### 优势

* 更好的代码组织方式，便于多人协作开发
* 利于代码复用和功能的扩充
* 易于实现按需加载
* 避免命名冲突和污染全局变量

#### CommonJS, AMD, CMD, ES6

* Node.js 是 commonJS规范的主要实践者，它有四个重要的环境变量为模块化的实现提供支持：`module`、`exports`、`require`、`global`。
* require.js 是 CMD 规范的主要实践者，采用异步方式加载模块。所有依赖这个模块的语句，都定义在一个回调函数中，加载完成后回调函数才会运行。
* sea.js 是 CMD 规范的主要实践者，AMD 推崇依赖前置、提前执行，CMD 推崇依赖就近、延迟执行。
* ES6 在语言标准的层面上，实现了模块功能，其模块功能主要由两个命令构成：`export`和`import`。

[详情](https://juejin.im/post/6844903576309858318)

#### ES6 模块与 CommonJS 模块的差异

* CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
* CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

### 浏览器多进程架构

浏览器内核是通过取得页面内容、整理信息（应用 CSS）、计算和组合最终输出可视化的图像结果，通常也被称为渲染引擎。Chrome 浏览器为每个 tab 页面单独启用进程，因此每个 tab 网页都有由其独立的渲染引擎实例。浏览器内核是多线程，在内核控制下各线程相互配合以保持同步，一个浏览器通常由以下常驻线程组成：GUI 渲染线程、JavaScript 引擎线程、定时触发器线程、事件触发线程、异步 http 请求线程。

[浏览器进程？线程？傻傻分不清楚！](https://imweb.io/topic/58e3bfa845e5c13468f567d5)

### jQuery.noConflict 实现原理

部分第三方库可以回用到名为 `$` 的变量，或者一个项目中需要用到多个版本。此时需要用来 `noConflict` 来防止变量冲突，代码实现如下：

``` js
(function(window, undefined) {
    var _jQuery = window.jQuery;
    var _$ = window.$;

    jQuery.extend({
        // 当 deep 为 true，同时还原 jQuery 变量
        noConflict: function(deep) {
            // 如果 window.$ 被 jQuery 修改了，还原全局变量
            if (window.$ === jQuery) window.$ = _$;
            if (deep && window.jQuery === jQuery) window.jQuery = _jQuery;
            return jQuery;
        },
    });
})(window);
```

整个运行流程： 储存 `window.jQuery` 和 `window.$` 变量（因此三方依赖需要在 jQuery 之前引入），判断是否两个变量是否被修改，如果是，还原全局变量。
