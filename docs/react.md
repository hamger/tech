### 生命周期
实例化：getDefaultProps -> getInitialState -> componentWillMount -> render -> (子组件实例化时的生命周期) -> componentDidMount(服务端没有)
存在期：componentWillReceiveProps -> shouldComponentUpdate -> componentWillUpdate -> render -> (子组件存在期的生命周期) -> componentDidUpdate
销毁时：componentWillUnmount -> (子组件销毁时的生命周期)

> setState 只可以在 componentWillReceiveProps 调用，[不合适或无意义或禁止在其他生命周期调用](http://varnull.cn/set-state-in-react-component-life-cycle/)。
