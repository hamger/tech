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
