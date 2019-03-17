### 生命周期
实例化：getDefaultProps -> getInitialState -> componentWillMount -> render -> componentDidMount(服务端没有)
存在期：componentWillReceiveProps -> shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate
销毁时：componentWillUnmount

setState 只可以在 componentWillReceiveProps 调用，[不合适或无意义或禁止在其他生命周期调用](http://varnull.cn/set-state-in-react-component-life-cycle/)。
