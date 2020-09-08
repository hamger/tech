### webpack 工作原理

#### 基本概念
* Entry：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
* Module：模块，在 Webpack 里一切皆模块，**一个模块对应着一个文件**。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
* Chunk：代码块，**一个 Chunk 由多个模块组合而成**，用于代码合并与分割。
* Loader：模块转换器，用于把模块原内容按照需求转换成新内容。
* Plugin：扩展插件，在 Webpack 构建流程中的特定时机会广播出对应的事件，插件可以监听这些事件的发生，在特定时机做对应的事情。

#### 流程概括
Webpack 的构建流程可以分为以下三大阶段：

1. 初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler。
2. 编译：从 Entry 发出，针对每个 Module 串行调用对应的 Loader 去翻译文件内容，再找到该 Module 依赖的 Module，递归地进行编译处理，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。
3. 输出：对编译后的 Module 组合成 Chunk，把 Chunk 转换成文件，输出到文件系统。

如果只执行一次构建，以上阶段将会按照顺序各执行一次。但在开启监听模式下，初始执行一次上述流程，当文件发生变化：编译 -> 输出。

> 在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

#### 输出文件
 Webpack 输出的 bundle.js 是下边的样子：
```js
(function(modules) {
  // 模拟 require 语句
  function __webpack_require__() {}
  // 执行存放所有模块数组中的第0个模块
  __webpack_require__(0);
})([/*存放所有模块的数组*/])
```
bundle.js 能直接运行在浏览器中的原因在于输出的文件中通过 `__webpack_require__` 函数定义了一个可以在浏览器中执行的加载函数来模拟 require 语句。

原来一个个独立的模块文件被合并到了一个单独的 bundle.js 的原因在于浏览器不能像 Node.js 那样快速地去本地加载一个个模块文件，而必须通过网络请求去加载还未得到的文件。 如果模块数量很多，加载时间会很长，因此把所有模块都存放在了数组中，执行一次网络加载。

如果仔细分析 `__webpack_require__` 函数的实现，你还有发现 Webpack 做了缓存优化： 执行加载过的模块不会再执行第二次，执行结果会缓存在内存中，当某个模块第二次被访问时会直接去内存中读取被缓存的返回值。

[详细过程](https://juejin.im/entry/6844903614469636103)

### 开发 loader

loader 为一个函数：`source => newSource`，接受的唯一参数是一个包含源文件内容的字符串，输出一个转化后的 string 或 buffer。

```js
// custom-loader
import { getOptions } from "loader-utils";
import { validateOptions } from "schema-utils";

const schema = {
  type: object,
  properties: {
    test: {
      type: string
    }
  }
};

export default function(source) {
  // 使用 getOptions 获取 webpack.config.js 中的 loader 配置
  const options = getOptions(this);

  // 校验 options 的 JSON Schema 常量
  validateOptions(schema, options, "Example Loader");

  // 在这里写转换 source 的逻辑 ...

  return `export default ${JSON.stringify(source)}`;
}
```

webpack 期望最后一个被调用 loader 返回一段可执行的 JS 脚本，例如：`return 'module.exports = ' + JSON.stringify(source);`

[手把手教你撸一个 Webpack Loader](https://juejin.im/post/5a698a316fb9a01c9f5b9ca0)

### 开发 plugin

一个插件由以下构成：

- 一个具名 JavaScript 函数。
- 在它的原型上定义 apply 方法。
- 指定一个触及到 webpack 本身的 事件钩子。
- 操作 webpack 内部的实例特定数据。
- 在实现功能后调用 webpack 提供的 callback。

```js
// 一个 JavaScript class
class MyExampleWebpackPlugin {
  // 将 `apply` 定义为其原型方法，此方法以 compiler 作为参数
  apply(compiler) {
    // 指定要附加到的事件钩子函数
    compiler.hooks.emit.tapAsync(
      "MyExampleWebpackPlugin",
      (compilation, callback) => {
        console.log("This is an example plugin!");
        console.log(
          "Here’s the `compilation` object which represents a single build of assets:",
          compilation
        );

        // 使用 webpack 提供的 plugin API 操作构建结果
        compilation.addModule(/* ... */);

        callback();
      }
    );
  }
}
```

apply 方法在安装插件时，会被 webpack compiler 调用一次，接收一个 webpack compiler 对象的引用。

在开发 Plugin 时最常用的两个对象就是 Compiler 和 Compilation，它们是 Plugin 和 Webpack 之间的桥梁。 Compiler 和 Compilation 的含义如下：
* Compiler 对象包含了 Webpack 环境所有的的配置信息，包含 options，loaders，plugins 这些信息，这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 Webpack 实例；
* Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。Compilation 对象也提供了很多事件回调供插件做扩展。通过 Compilation 也能读取到 Compiler 对象。

Compiler 和 Compilation 的区别在于：Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译。

[创建一个插件](https://webpack.docschina.org/contribute/writing-a-plugin/)
