### 生命周期
react 生命周期分为三个阶段：挂载、更新、卸载。v16.3之前和v16.4之后的生命周期不同。

#### v16.3
挂载：constructor -> componentWillMount -> render -> (子组件实例化时的生命周期) -> componentDidMount(服务端没有)

更新：componentWillReceiveProps -> shouldComponentUpdate -> componentWillUpdate -> render -> (子组件存在期的生命周期) -> componentDidUpdate

卸载：componentWillUnmount -> (子组件销毁时的生命周期)

> 为不安全的生命周期引入别名：UNSAFE_componentWillMount、UNSAFE_componentWillReceiveProps 和 UNSAFE_componentWillUpdate。

#### v16.4
挂载：constructor -> getDerivedStateFromProps -> componentWillMount -> render -> (子组件实例化时的生命周期) -> componentDidMount

更新：getDerivedStateFromProps -> shouldComponentUpdate -> componentWillUpdate -> render -> (子组件存在期的生命周期) -> getSnapshotBeforeUpdate -> componentDidUpdate

卸载：componentWillUnmount -> (子组件销毁时的生命周期)

错误处理，当渲染过程，生命周期，或子组件的构造函数中抛出错误时，会调用如下方法：getDerivedStateFromError -> componentDidCatch

> v17 版本中将移除componentWillMount，componentWillReceiveProps，componentWillUpdate

### react-router 原理

在 Router 组件的构造器中监听路由变化，当路由变化时修改`this.state.location`，并同过`context`传给 Route 组件，触发 Route 组件的 render 函数。

```js
class Router extends React.Component {
  constructor(props) {
    super(props);
    // ...
    this.unlisten = props.history.listen(location => {
      if (this._isMounted) {
        this.setState({ location });
      } else {
        this._pendingLocation = location;
      }
    });
  }
  // ....
  render() {
    return (
      <RouterContext.Provider
        children={this.props.children || null}
        value={{
          history: this.props.history,
          location: this.state.location,
          match: Router.computeRootMatch(this.state.location.pathname),
          staticContext: this.props.staticContext
        }}
      />
    );
  }
}
```

### fiber

在 react@16 以前的版本，reconciler（现被称为 stack reconciler ）采用自顶向下递归，从根组件或 setState() 后的组件开始，更新整个子树。当组件树越来越大，递归遍历的成本就越高，持续占用主线程，这样主线程上的布局、动画等周期性任务以及交互响应就无法立即得到处理，造成顿卡的视觉效果。为了解决这个问题，引入 fiber reconciler ，对 diff 阶段进行拆分，保证不会阻塞主线程（Main thread）。

以一个 fiber 为单位来进行拆分，fiber tree 是根据 VDOM tree 构造出来的，树形结构完全一致，只是包含的信息不同。以下是 fiber tree 节点的部分结构：

```js
{
  alternate: Fiber|null, // diff后差异信息
  return: Fiber|null, // 指向 Fiber Tree 中的父节点
  child: Fiber|null, // 指向第一个子节点
  sibling: Fiber|null, // 指向兄弟节点
  endingWorkPriority: PriorityLevel, // 标记子树上待更新任务的优先级
	stateNode: any, // 管理 instance 自身的特性
  nextEffect: Fiber | null, // 单链表结构，方便遍历 Fiber Tree 上有副作用的节点
}
```

[怎么拆、执行顺序](https://juejin.im/post/5be969656fb9a049ad76931f)

### setState 之后做了什么

1. enqueueSetState将state放入队列中，并调用enqueueUpdate处理要更新的Component
2. 如果组件当前正处于update事务中，则先将Component存入dirtyComponent中。否则调用batchedUpdates处理。
3. batchedUpdates发起一次transaction.perform()事务
4. 开始执行事务初始化，运行，结束三个阶段。
  初始化：事务初始化阶段没有注册方法，故无方法要执行；
  运行：执行setSate时传入的callback方法；
  结束：更新isBatchingUpdates为false，并执行FLUSH_BATCHED_UPDATES这个wrapper中的close方法；
5. FLUSH_BATCHED_UPDATES在close阶段，会循环遍历所有的dirtyComponents，调用updateComponent刷新组件，并执行它的pendingCallbacks, 也就是setState中设置的callback。

### transaction（事务）

事务的概念源于数据库，事务具有四个特征：原子性（ Atomicity ）、一致性（ Consistency ）、隔离性（ Isolation ）和持久性（ Durability ）。这四个特性简称为 ACID 特性。

1. 原子性：事务是数据库的逻辑工作单位，不可分割，事务中包含的各操作要么都做，要么都不做
2. 一致性：事务执行的结果必须是使数据库从一个一致性状态变到另一个一致性状态。
3. 隔离性：一个事务的执行不能被其它事务干扰。
4. 持续性：也称永久性，指一个事务一旦提交，它对数据库中的数据的改变就应该是永久性的，不能回滚。

> 应用场景： A转100元给B，A账户-100，B账户必须+100



