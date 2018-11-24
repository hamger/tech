1. then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）

2. Promise.prototype.catch方法是.then(null, rejection)的别名，用于指定发生错误时的回调函数。catch方法返回的还是一个 Promise 对象，因此后面还可以接着调用then方法。

3. Promise 在resolve语句后面，再抛出错误，不会被捕获，等于没有抛出。因为 Promise 的状态一旦改变，就永久保持该状态，不会再变了。

4. 一般来说，不要在then方法里面定义 Reject 状态的回调函数（即then的第二个参数），总是使用catch方法。