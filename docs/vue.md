### 生命周期

实例化：beforeCreate -> created -> beforeMount -> (子组件实例化时的生命周期) -> mounted

更新时：beforeUpdate -> (如果数据通过 props 传给子组件，触发子组件更新时的生命周期) -> updated
keep-alive更新时: beforeUpdate -> A deactivated -> B activated -> updated

销毁时：beforeDestroy -> (子组件销毁时的生命周期) -> destroyed

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

### 数据响应式原理

1. `initState`对属性进行处理，执行`observe(data)`，内部使用`Object.defineProperty`将`data`变成可监听结构（data 的 property 全部转为 getter/setter，为每一个属性中创建一个`dep`，用于管理依赖于属性的`watcher`），getter 中的代码逻辑是调用`dep.depend()`，添加 watcher 到 dep.watchers，添加 dep 到 watcher.deps。setter 中的代码逻辑是调用`dep.notify()`。

2. 初始化时会执行`render`函数，此时会触发对应属性的`getter`访问器，收集数据和模板之间的依赖关系，并记录当前的虚拟 dom 树`$vDomTree`

3. 当`data`变化时，触发对应属性的`setter`访问器，执行`dep.notify()`，从而执行`watcher.update()`，触发`render`函数，生成新的虚拟 dom 树`vDomTree`，使用`diff`算法计算最小改动`var patches = diff(this.$vDomTree, vDomTree)`，将补丁应用到真实 dom 树`this.$el = patch(this.$el, patches)`

```js
export default class Dep {
  static target?: Watcher
  id: number
  watchers: Array<Watcher>

  constructor() {
    this.id = id++
    this.watchers = []
  }

  addWatcher(watcher: Watcher) {
    this.watchers.push(watcher)
  }

  removeWatcher(watcher: Watcher) {
    remove(this.watchers, watcher)
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify() {
    this.watchers.forEach(watcher => {
      watcher.update()
    })
  }
}
```

> 这些 getter/setter 对用户来说是不可见的，但是在内部它们让 Vue 能够追踪依赖，在 property 被访问和修改时通知变更。

> 每个组件实例都对应一个 watcher 实例，它会在组件渲染的过程中把“接触”过的数据 property 记录为依赖。之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。

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

若 render 函数存在则不进行 template 编译。若 render 函数不存在，template 会被编译成 [AST](https://juejin.im/post/5ab83f67f265da237e09b2f6) （抽象语法树：源代码的抽象语法结构的树状表现形式），**AST 会经过 generate 函数得到 render 和 staticRenderFns** ，render 函数在运行后会返回虚拟 DOM 节点，供页面渲染以及在 update 的时候 patch。

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

### Proxy 比 Object.defineProperty 的优势
* Proxy 可以直接监听对象而非属性
* Proxy 可以直接监听数组的变化
* Proxy 有多达13种拦截方法
* Proxy 作为新标准受到浏览器厂商重点持续的性能优化
* Proxy 的劣势就是兼容性问题

### 简述 diff 算法
`diff(oldTree, newTree)` 算法最后生成一个补丁`patches`（`patches`是带元素id的对象数组，补丁类型分为四类：REPLACE（替换元素）、ORDER（列表排序）、PROPS（变更属性）、TEXT（变更文本）），该补丁会通过调用`patch(root, patches)`应用到真实 dom 树中。

记旧虚拟树为`oldTree`、新虚拟树为`newTree`、补丁为`patches`、当前补丁为`currentPatch`。开始用以下顺序比较`oldTree`和`newTree`：

1. 判断两个节点是否值得比较，为否则`currentPatch.push{type:'REPLACE',node: newNode})`，为真则进行以下逻辑
```js
function sameVnode (oldTree, newTree) {
  return (
    oldTree.key === newTree.key &&  // key值
    oldTree.tag === newTree.tag  // 标签名
  )
}
```

2. 判断是否是文本节点`isString(oldNode) && isString(newNode)) && new Node !== oldNode`， 为真则`currentPatch.push({type: 'TEXT',text: newNode})`，为否则进行以下逻辑

3. 比较元素的属性`var propsPatches = diffProps(oldNode, newNode)`，若`propsPatches`为真则`currentPatch.push({type: 'PROPS',props: propsPatches})`，然后比较他们的子元素，其中会设置涉及到列表的比较`listDiff`
```js
diffChildren(
  oldNode.children,
  newNode.children,
  index,
  patches,
  currentPatch
) {
  // oldchildren 和 newchildren 为数组
  var diffs = listDiff(oldChildren, newChildren, 'key')
  newChildren = diffs.children

  if (diffs.moves.length) {
    currentPatch.push({
      type: 'ORDER',
      moves: diffs.moves
    })
  }

  var leftNode = null
  var currentNodeIndex = index
  oldChildren.forEach((child, i) => {
    var newChild = newChildren[i]
    // 计算当前节点标记，区分左边的节点是否拥有子节点的情况
    currentNodeIndex =
      leftNode && leftNode.count ?
        currentNodeIndex + leftNode.count + 1 :
        currentNodeIndex + 1
    // 深度遍历子节点
    walk(child, newChild, currentNodeIndex, patches)
    // 更新左边的节点
    leftNode = child
  })
}
```
如果`listDiff`返回的结果中存在排序信息则`currentPatch.push({type: 'ORDER',moves: diffs.moves})`，
遍历`oldChildren`，计算节点标记，递归遍历子节点`walk(child, newChild, currentNodeIndex, patches)`，直到遍历完所有节点，过程中所有的补丁信息都被保存在`patches`中。
```js
if (currentPatch.length) {
  patches[index] = currentPatch
}
```

#### 列表比较

[vue 的 listDiff](https://juejin.im/post/6844903607913938951) : 双端比对算法

[react 的 listDiff](https://zhuanlan.zhihu.com/p/20346379) :  单指针从左到右
