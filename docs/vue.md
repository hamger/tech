### 生命周期

实例化：beforeCreate -> created -> beforeMount -> (子组件实例化时的生命周期) -> mounted
更新时：父 beforeUpdate -> (如果数据通过 props 传给子组件，触发子组件更新时的生命周期) -> 父 updated
销毁时：beforeDestroy -> (子组件销毁时的生命周期) -> destroyed
keep-alive: 父 beforeUpdate -> A deactivated -> B activated -> 父 updated

> 修改没有在模板中被使用的数据时，不会触发`beforeUpdate`和`updated`钩子

> `<keep-alive></keep-alive>`用于保留组件状态或避免重新渲染，当组件在`<keep-alive>`内被切换，不触发`created`钩子，它的`activated`和`deactivated`钩子将被执行

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
