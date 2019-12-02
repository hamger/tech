# tech

[A collection of technical points in front-end.](https://hamger.github.io/tech/)

## Construction
```
.
├── build  ---------------------------- 构建配置
├── docs  ----------------------------- 文档内容
└── src  ------------------------------ demo代码
    ├── page01 ------------------------ 页面A代码
        ├── index.html ---------------- 页面A的html代码
        └── index.js ------------------ 页面A的js代码入口
    └── page02 ------------------------ 页面B代码
```

## Start
### 安装依赖
``` bash
npm install
```

### 文档展示
```
npm run docs
```

### 本地启动demo
```bash
npm run dev
```
访问`http://localhost:8080/page01`可以看到页面A的内容，同理可访问其他页面的内容。


### 打包代码
```bash
npm run build
```
将`src`目录中的代码打包到`dist`目录，内容如下
```
.
└── dist ------------------------------ 生产代码
    ├── page01 ------------------------ 页面A的生产代码
    └── page02 ------------------------ 页面B的生产代码
```

