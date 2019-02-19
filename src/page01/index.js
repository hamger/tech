import './index.scss'
document.write('<h1>page01</h1>')

function Promise (fn) {
  var state = 'pending',
    value = null,
    callbacks = []

  this.then = function (onFulfilled) {
    return new Promise(function (resolve) {
      handle({
        onFulfilled: onFulfilled || null,
        resolve: resolve
      })
    })
  }

  function handle (callback) {
    // 如果异步操作还没有执行完，将 callback 推入到队列中，如果执行完了，直接执行回调 callback.resolve()
    if (state === 'pending') {
      callbacks.push(callback)
      return
    } // 如果then中没有传递任何东西
    if (!callback.onFulfilled) {
      callback.resolve(value)
      return
    }

    var ret = callback.onFulfilled(value)
    callback.resolve(ret)
  }

  function resolve (newValue) {
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      // 转入的是 promise 实例的情况统一都放入 callbacks
      var then = newValue.then
      if (typeof then === 'function') {
        then.call(newValue, resolve)
        return
      }
    }
    state = 'fulfilled'
    value = newValue
    setTimeout(function () {
      callbacks.forEach(function (callback) {
        handle(callback)
      })
    }, 0)
  }

  fn(resolve)
}
