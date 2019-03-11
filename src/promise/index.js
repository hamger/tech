function Promise (executor) {
  var self = this

  self.status = 'pending'
  self.onResolvedCallback = []
  self.onRejectedCallback = []

  function resolve (value) {
    if (value instanceof Promise) {
      return value.then(resolve, reject)
    }
    setTimeout(function () {
      // 异步执行所有的回调函数
      if (self.status === 'pending') {
        self.status = 'resolved'
        self.data = value
        console.log(self.onResolvedCallback)
        for (var i = 0; i < self.onResolvedCallback.length; i++) {
          self.onResolvedCallback[i](value)
        }
      }
    })
  }

  function reject (reason) {
    setTimeout(function () {
      // 异步执行所有的回调函数
      if (self.status === 'pending') {
        self.status = 'rejected'
        self.data = reason
        for (var i = 0; i < self.onRejectedCallback.length; i++) {
          self.onRejectedCallback[i](reason)
        }
      }
    })
  }

  try {
    executor(resolve, reject)
  } catch (reason) {
    reject(reason)
  }
}

/*
resolvePromise函数即为根据x的值来决定promise2的状态的函数，
x为`promise2 = promise1.then(onResolved, onRejected)`里`onResolved/onRejected`的返回值，
`resolve`和`reject`实际上是`promise2`的`executor`的两个实参。
*/
function resolvePromise (promise2, x, resolve, reject) {
  var then
  var thenCalledOrThrow = false

  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise!'))
  }

  if (x instanceof Promise) {
    x.then(resolve, reject)
    return
  }
  // 处理 thenable 对象
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      then = x.then // because x.then could be a getter
      if (typeof then === 'function') {
        then.call(
          x,
          function rs (y) {
            if (thenCalledOrThrow) return
            thenCalledOrThrow = true
            return resolvePromise(promise2, y, resolve, reject)
          },
          function rj (r) {
            if (thenCalledOrThrow) return
            thenCalledOrThrow = true
            return reject(r)
          }
        )
      } else {
        resolve(x)
      }
    } catch (e) {
      if (thenCalledOrThrow) return
      thenCalledOrThrow = true
      return reject(e)
    }
  } else {
    resolve(x)
  }
}

// promise2 = promise1.then(onResolved, onRejected)
function execute (promise2, val, callback, resolve, reject) {
  try {
    var x = callback(val)
    // 执行回调函数 onResolved/onRejected 后，其返回值会决定 promise2 的状态和值
    resolvePromise(promise2, x, resolve, reject)
  } catch (r) {
    reject(r)
  }
}

Promise.prototype.then = function (onResolved, onRejected) {
  var self = this
  var promise2
  onResolved =
    typeof onResolved === 'function' ?
      onResolved :
      function (v) {
        return v
      }
  onRejected =
    typeof onRejected === 'function' ?
      onRejected :
      function (r) {
        throw r
      }

  if (self.status === 'resolved') {
    return (promise2 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        execute(promise2, self.data, onResolved, resolve, reject)
      })
    }))
  }

  if (self.status === 'rejected') {
    return (promise2 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        execute(promise2, self.data, onRejected, resolve, reject)
      })
    }))
  }

  if (self.status === 'pending') {
    // 这里之所以没有异步执行，是因为这些函数必然会被resolve或reject调用，而resolve或reject函数里的内容是异步执行的
    return (promise2 = new Promise(function (resolve, reject) {
      self.onResolvedCallback.push(function (value) {
        execute(promise2, value, onResolved, resolve, reject)
      })
      self.onRejectedCallback.push(function (reason) {
        execute(promise2, reason, onRejected, resolve, reject)
      })
    }))
  }
}

Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}

// 指定不管 Promise 对象最后状态如何，都会执行的操作
// 如果不使用finally方法，同样的语句需要为成功和失败两种情况各写一次。有了finally方法，则只需要写一次。
Promise.prototype.finally = function (fn) {
  // 所有的then调用是一起的，但是这个then里调用fn又异步了一次，所以它总是在最后调用。
  // 当然这里只能保证在已添加的函数里是最后一次。
  return this.then(
    function (v) {
      setTimeout(fn)
      return v
    },
    function (r) {
      setTimeout(fn)
      throw r
    }
  )
}

Promise.resolve = function (value) {
  var promise = new Promise(function (resolve, reject) {
    resolvePromise(promise, value, resolve, reject)
  })
  return promise
}

Promise.reject = function (reason) {
  return new Promise(function (resolve, reject) {
    reject(reason)
  })
}

Promise.all = function (promises) {
  return new Promise(function (resolve, reject) {
    var resolvedCounter = 0
    var promiseNum = promises.length
    var resolvedValues = new Array(promiseNum)
    for (var i = 0; i < promiseNum; i++) {
      ;(function (i) {
        Promise.resolve(promises[i]).then(
          function (value) {
            resolvedCounter++
            resolvedValues[i] = value
            if (resolvedCounter === promiseNum) {
              return resolve(resolvedValues)
            }
          },
          function (reason) {
            return reject(reason)
          }
        )
      })(i)
    }
  })
}

Promise.race = function (promises) {
  return new Promise(function (resolve, reject) {
    for (var i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(
        function (value) {
          return resolve(value)
        },
        function (reason) {
          return reject(reason)
        }
      )
    }
  })
}

var p = new Promise(function (resolve) {
  setTimeout(function () {
    resolve(1) // 改变的是 p 的状态
  }, 100)
})
p.then(function foo (value) {
  console.log(value)
  var p2 = new Promise(resolve => {
    setTimeout(function () {
      resolve(value + 2) // 改变的是 p2 的状态
    }, 200)
  })
  return p2
}).then(function foo2 (value) {
  console.log(value)
})
/**
 * p.then 注册 foo ， p.then 返回 x，x.then 注册 foo2，x.then 返回 x2
 * 100ms后执行 p 的 resolve(1) ，p 的状态变更为 'resolved' 并异步触发 foo
 * foo 函数返回 p2 , 由于 p2 是 Promise 实例，执行 p2.then(x_resolve, x_reject)
 * 200ms 后执行 p2 的 resolve(value + 2) ，p2 的状态变更为 'resolved' 并异步触发 x_resolve 传入的参数是 3
 * x 的状态变更为 'resolved' 并异步触发 foo2，最后打印出 3
 */

Promise.all([
  new Promise(function (resolve) {
    setTimeout(function () {
      resolve(1)
    })
  }),
  new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(true)
    }, 800)
  }),
  new Promise(function (resolve) {
    setTimeout(function () {
      resolve('hello')
    }, 500)
  })
])
  .then(function (posts) {
    console.log(posts)
  })
  .catch(function (reason) {
    console.log(reason)
  })

var p3 = new Promise((resolve, reject) =>
  setTimeout(() => {
    resolve(new Date())
  }, 1000)
)
// onResolvedCallback 是数组是因为考虑到以下情况
var a = p3.then(a => console.log(a))
var b = p3.then(a => console.log(a))
