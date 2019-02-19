### v-slot

Vue 2.6 之后新增了 `v-slot` 指令，新语法将普通的插槽 (slot) 和作用域插槽 (scoped slot) 统一在一个指令语法下。

> 作用域插槽实现将子组件的数据供父组件消费

#### 默认作用域插槽 (default scoped slot)

```html
<my-component v-slot="{ msg }">{{ msg }}</my-component>
```

#### 具名插槽 (named slots)

```html
<my-component>
  <template v-slot:header>
    <p>Header</p>
  </template>

  <template v-slot:item="{ data }">
    <h2>{{ data.title }}</h2>
    <p>{{ data.text }}</p>
  </template>

  <template v-slot:footer>
    <p>Footer</p>
  </template>
</my-component>
```
