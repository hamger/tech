1. then 方法返回的是一个新的 Promise 实例（注意，不是原来那个 Promise 实例）

2. Promise.prototype.catch 方法是.then(null, rejection)的别名，用于指定发生错误时的回调函数。catch 方法返回的还是一个 Promise 对象，因此后面还可以接着调用 then 方法。一般来说，不要在 then 方法里面定义 Reject 状态的回调函数（即 then 的第二个参数），总是使用 catch 方法。

3. Promise 在 resolve 语句后面，再抛出错误，不会被捕获，等于没有抛出。因为 Promise 的状态一旦改变，就永久保持该状态，不会再变了。

4. Promise 对象的状态不受外界影响。Promise 对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和 rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。Promise 对象的状态改变，只有两种可能：从 pending 变为 fulfilled 和从 pending 变为 rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。

5. 对于这种嵌套的对象，一旦遇到同名属性，Object.assign 的处理方法是替换，而不是添加。Object.assign 可以用来处理数组，但是会把数组视为对象。

```js
Object.assign([1, 2, 3], [4, 5]);
// [4, 5, 3]
```

6. 生成一个 dog 对象，其原型为 animal 对象。

```js
var dog = Object.create(animal);
Object.getPrototypeOf(dog); // 读操作
Object.setPrototypeOf(dog, prototype); // 写操作
```

7. Object 的属性有 4 个描述起行为的特性：

- Configurable:表示能否通过 delete 删除属性从而重新定义属性；
- Enumerable：表示能否通过 for-in 循环返回属性
- writable：表示能否修改属性的值
- Value：表示这个属性的值

以上四个属性在不显示调用 Object.defineProperty()的时候，前三个默认值都为 true，而 value 为你自己设定的值，如果不设定的话则为 undefined。

