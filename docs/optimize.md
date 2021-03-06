### 使用 webpack 优化

#### 缩小文件的搜索范围

##### resolve

1. 设置`resolve.modules:[path.resolve(__dirname, 'node_modules')]`，`resolve.modules`告诉 webpack 去哪些目录下寻找第三方模块。

2. 设置`resolve.mainFields:['main']`，设置尽量少的值可以减少入口文件的搜索步骤

3. 对庞大的第三方模块设置`resolve.alias`, 使 webpack 直接使用库的 min 文件，避免库内解析

4. 合理配置`resolve.extensions`，减少文件查找

##### noParse

`module.noParse`字段告诉 Webpack 不必解析哪些文件，可以用来排除对非模块化库文件的解析

```js
module: {
  noParse: [/jquery|chartjs/, /react\.min\.js$/];
}
```

#### 缩短打包时间

##### externals

Webpack 可以配置 externals 来将依赖的库指向**全局变量**，从而不再打包这个库，比如

```js
module.exports = {
  externals: {
    react: "window.React"
  }
};
```

当然需要引入 react.min.js ，使 window 中存在 React 。

##### webpack-parallel-uglify-plugin

webpack 提供的 UglifyJS 插件采用单线程压缩，速度很慢，使用 [webpack-parallel-uglify-plugin](https://www.npmjs.com/package/webpack-parallel-uglify-plugin) 开启多线程压缩。

```js
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");
module.exports = {
  plugins: [new ParallelUglifyPlugin()]
};
```

##### happypack

[happypack](https://www.npmjs.com/package/happypack) 的原理是让 loader 可以多进程去处理文件，同时还利用缓存来使得 rebuild 更快。

[三十分钟掌握 Webpack 性能优化](https://juejin.im/post/5b652b036fb9a04fa01d616b)

### 浏览器优化

#### Performance API

Performance Timing 记录了资源加载和解析过程中各个关键点的时间点，每个过程中开始和结束的关键时间戳浏览器已经使用 `performance.timing` 来记录了，所以根据这个记录并结合简单的计算，我们就可以得到页面中每个过程所消耗的时间。

```js
function performanceTest() {
  let timing = performance.timing,
    requestTime = timing.responseEnd - timing.requestStart,
    initDomTreeTime = timing.domInteractive - timing.responseEnd;

  console.log("request 请求耗时：" + requestTime);
  console.log("请求完毕至DOM加载：" + initDomTreeTime);
}
```

preformance 还提供了一些其他方面的功能，我们可以根据具体需要进行选择使用。

- `performance.memory`: 内存占用的具体数据
- `performance.getEntries()`: 获取页面所有加载资源的`performance timing`情况，浏览器获取网页时，会对网页中每一个对象(脚本文件、样式表、图片文件等)发出一个 HTTP 请求，`performance.getEntries` 方法以数组形式返回所有请求的时间统计信息。
- `performance.navigation`: 提供用户行为信息，包含网络请求的类型和重定向次数等

#### Profile 工具

使用 `console.profile()` 和`console.profileEnd()` 就可以分析中间一段代码执行时系统的内存或 CPU 资源的消耗情况，然后配合浏览器的 Profile 查看比较消耗系统内存或 CPU 资源的操作。

```js
console.profile();
for (let i = 0; i < 100000; i++) {
  console.log(i * i);
}
console.profileEnd();
```

[前端性能优化之性能测试](https://juejin.im/post/5a41abb35188252a3d383eb8)

### 项目性能优化

- 减少 HTTP 请求数
- 权衡减少 DNS 查询 和 多域名提供资源
- 使用 CDN（加速、安全）
- 图片懒加载
- 减少 DOM 元素数量 和 DOM 操作
- 压缩 JavaScript 、 CSS 、字体、图片等
- 把图标合并在同一张图片里面，用 background-position 去控制
- 避免图片 src 为空（出现一次`<img src="" />`会导致多一次请求）
- 样式表放在头部，脚本放在页面底部
- 避免使用 iframe
- 减少多余的 Cookie 携带

> 静态资源往往并不需要 Cookie 携带什么认证信息。把静态资源和主页面置于**不同的域名**下，就可以完美地避免请求中携带不必要的 Cookie。

> iframe 缺点
> - iframe 会阻塞主页面的 Onload 事件；
> - 搜索引擎的检索程序无法解读这种页面，不利于 SEO;
> - iframe 框架页面会增加服务器的 http 请求
