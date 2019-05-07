### 生命周期

实例化：beforeCreate -> created -> beforeMount -> (子组件实例化时的生命周期) -> mounted

更新时：父 beforeUpdate -> (如果数据通过 props 传给子组件，触发子组件更新时的生命周期) -> 父 updated

销毁时：beforeDestroy -> (子组件销毁时的生命周期) -> destroyed
keep-alive: 父 beforeUpdate -> A deactivated -> B activated -> 父 updated

> 修改没有在模板中被使用的数据时，不会触发`beforeUpdate`和`updated`钩子

> `<keep-alive></keep-alive>`用于保留组件状态或避免重新渲染，当组件在`<keep-alive>`内被切换，不触发`created`钩子，它的`activated`和`deactivated`钩子将被执行

### 双向绑定

```js
<input v-model="something">
```

以上代码其实是以下代码的语法糖：

```js
<input v-bind:value="something" v-on:input="something = $event.target.value">
```

### v-slot

Vue 2.6 之后新增了 `v-slot` 指令（缩写为`#`），新语法将普通的插槽 (slot) 和作用域插槽 (scoped slot) 统一在一个指令语法下。

> 作用域插槽实现将子组件的数据供父组件消费

#### 默认作用域插槽 (default scoped slot)

```html
<my-component v-slot="{ msg }">{{ msg }}</my-component>
```

#### 具名插槽 (named slots)

```html
<my-component>
  <template #header>
    <p>Header</p>
  </template>

  <template v-slot:item="{ data }">
    <h2>{{ data.title }}</h2>
    <p>{{ data.text }}</p>
  </template>

  <template #footer>
    <p>Footer</p>
  </template>
</my-component>
```

### template 编译

若 render 函数存在则不进行 template 编译。若 render 函数不存在，template 会被编译成 [AST](https://juejin.im/post/5ab83f67f265da237e09b2f6) （抽象语法树：源代码的抽象语法结构的树状表现形式），AST 会经过 generate 函数得到 render 和 staticRenderFns ，render 函数在运行后会返回虚拟 DOM 节点，供页面渲染以及在 update 的时候 patch。

```js
// 返回 render 和 staticRenderFns ，这是vue的编译时优化，静态节点不需要在 VNode 更新时进行 patch，优化性能
const { render, staticRenderFns } = compileToFunctions(
  template,
  {
    shouldDecodeNewlines,
    delimiters: options.delimiters
  },
  this
);
```

[聊聊 Vue.js 的 template 编译](https://juejin.im/post/59da1c116fb9a00a4a4cf6dd)

### vue-router 跳转和 location.href 区别

vue-router 是 hash 改变，不刷新页面；location.href 是页面跳转，刷新页面
