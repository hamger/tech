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

// 根据 x 的值来决定 promise2（then 方法返回的 Promise 实例）的状态
function resolvePromise (promise2, x, resolve, reject) {
  var then
  var thenCalledOrThrow = false

  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise!'))
  }

  if (x instanceof Promise) {
    if (x.status === 'pending') {
      // because x could resolved by a Promise Object
      x.then(function (v) {
        resolvePromise(promise2, v, resolve, reject)
      }, reject)
    } else {
      // but if it is resolved, it will never resolved by a Promise Object but a static value;
      x.then(resolve, reject)
    }
    return
  }

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

// 执行 then 中注册的回调函数，并根据回调函数的执行结果返回新的 promise
function execute (promise2, val, callback, resolve, reject) {
  try {
    var x = callback(val)
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

Promise.prototype.finally = function (fn) {
  // 因为所有的 then 调用同步的，只要在 finally 中异步调用 then 就可以保证 fn 总是最后被调用
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
 * foo 函数返回 p2 , 由于 p2 是 Promise 实例且处于 pending 状态，执行 p2.then(function cb (v) {
        resolvePromise(x, v, resolve, reject) // 根据 v 的值来决定 x 的状态
      }, reject) (此时 p2.then 注册了回调函数 cb)
 * 200ms 后执行 p2 的 resolve(value + 2) ，p2 的状态变更为 'resolved' 并异步触发 cb ，执行 resolvePromise(x, v, resolve, reject)
 * 此时 v 的值是 3 ，是原始类型，直接执行 x 的 resolve(3)，x 的状态变更为 'resolved' 并异步触发 foo2
 * 由于 v 的值作为参数传给了 foo2 ，所有最后打印出 3
 * 综上可知，x 起到一个桥梁的作用，连接当前 promise (也就是 x) 和下一个 promise (也就是 x2)，在 p2 中调用 resolve
 * 改变了 x 的状态，从而触发 x 的回调函数
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
