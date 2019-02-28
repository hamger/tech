import './index.scss'
document.write('<h1>page01</h1>')

function Promis (fn) {
  var state = 'pending',
    value = null,
    callbacks = []

  this.then = function (onFulfilled) {
    return new Promis(function (resolve) {
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
    }
    // 如果then中没有传递任何东西，就参数渗透
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
      // 转入的是 promise 实例的情况
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

var p = new Promis(function (resolve) {
  // 遇到异步事件，挂起到 bar 到宏任务队列
  setTimeout(function bar () {
    resolve(1)
  })
})
// 通过 then 方法注册回调函数 foo 和 foo2
/**
 * 注册后，p 的 callbacks = [
    {
      onFulfilled: foo,
      resolve: resolve
    }
  ]，
  p2 的 callbacks = [
    {
      onFulfilled: foo2,
      resolve: resolve
    }
  ]
 */
var p2
p.then(function foo (value) {
  console.log(value)
  p2 = new Promis(resolve => {
    setTimeout(function bar2 () {
      resolve(value * 2)
    })
  })
  return p2
}).then(function foo2 (value) {
  console.log(value)
})
console.log(p2)
// 同步代码执行完毕，接下来执行 bar 函数
/**
 * 1. resolve(1)
 * 2. state = 'fulfilled'; value = 1
 * 3. 遍历 callbacks，依次调用 handle(callback)
 * 4. resolve(foo(value))，foo(value) 返回的是 Promis 实例，因此执行 p2.then(resolve),
 * 得到 p2 的 callbacks
 */
