### 生命周期

实例化：getDefaultProps -> getInitialState -> componentWillMount -> render -> (子组件实例化时的生命周期) -> componentDidMount(服务端没有)

存在期：componentWillReceiveProps -> shouldComponentUpdate -> componentWillUpdate -> render -> (子组件存在期的生命周期) -> componentDidUpdate

销毁时：componentWillUnmount -> (子组件销毁时的生命周期)

> setState 只可以在 componentWillReceiveProps 调用，[不合适或无意义或禁止在其他生命周期调用](http://varnull.cn/set-state-in-react-component-life-cycle/)。

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
  alternate: Fiber|null, // 在fiber更新时克隆出的镜像fiber，对fiber的修改会标记在这个fiber上
  nextEffect: Fiber | null, // 单链表结构，方便遍历 Fiber Tree 上有副作用的节点
  endingWorkPriority: PriorityLevel, // 标记子树上待更新任务的优先级
	stateNode: any, // 管理 instance 自身的特性
  return: Fiber|null, // 指向 Fiber Tree 中的父节点
  child: Fiber|null, // 指向第一个子节点
  sibling: Fiber|null, // 指向兄弟节点
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