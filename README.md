# tech

[A collection of technical points in front-end.](https://hamger.github.io/tech/)

## Construction

```
.
├── package.json  --------------------- 项目描述
├── README.md  ------------------------ 说明文件
├── build  ---------------------------- 构建配置
├── docs  ----------------------------- 文档代码
└── src  ------------------------------ 演示代码（提供代码实践）
    ├── page01 ------------------------ 页面A
        ├── index.html ---------------- 页面A的 html 代码
        └── index.js ------------------ 页面A的 js 代码入口
    └── page02 ------------------------ 页面B
```

## Start

### 安装依赖

```bash
npm install
```

### 本地文档

```bash
npm run docs
```

访问`http://localhost:3000`预览文档

### 本地演示

```bash
npm run dev
```

访问`http://localhost:8080/page01`可以看到页面 A 的内容，同理可访问其他页面的内容。

### 打包演示代码

```bash
npm run build
```

打包后根目录下会出现`dist`文件夹，其中内容如下

```
.
└── dist ------------------------------ 生产代码
    ├── page01 ------------------------ 页面A的生产代码
    └── page02 ------------------------ 页面B的生产代码
```
