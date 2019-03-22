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

[创建一个插件](https://webpack.docschina.org/contribute/writing-a-plugin/)
