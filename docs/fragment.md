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

- Configurable：表示能否通过 delete 删除属性从而重新定义属性
- Enumerable：表示能否通过 for-in 循环返回属性
- writable：表示能否修改属性的值
- Value：表示这个属性的值

以上四个属性在不显示调用 Object.defineProperty()的时候，前三个默认值都为 true，而 value 为你自己设定的值，如果不设定的话则为 undefined。

8. ES6 规定，默认的 Iterator 接口部署在数据结构的 Symbol.iterator 属性，或者说，一个数据结构只要具有 Symbol.iterator 属性，就可以认为是“可遍历的”（iterable）。

```js
const obj = {
  [Symbol.iterator]: function() {
    return {
      next: function() {
        return {
          value: 1,
          done: true
        };
      }
    };
  }
};
```

```js
let arr = ["a", "b", "c"];
// 数组自带 Symbol.iterator 属性
let iter = arr[Symbol.iterator]();

iter.next(); // { value: 'a', done: false }
iter.next(); // { value: 'b', done: false }
iter.next(); // { value: 'c', done: false }
iter.next(); // { value: undefined, done: true }
```

9. 调用 Generator 函数，返回一个遍历器对象，代表 Generator 函数的内部指针。以后，每次调用遍历器对象的 next 方法，就会返回一个有着 value 和 done 两个属性的对象。value 属性表示当前的内部状态的值，是 yield 表达式后面那个表达式的值；done 属性是一个布尔值，表示是否遍历结束。

10. yield 表达式如果用在另一个表达式之中，必须放在圆括号里面。

```js
function* demo() {
  console.log('Hello' + yield); // SyntaxError
  console.log('Hello' + yield 123); // SyntaxError

  console.log('Hello' + (yield)); // OK
  console.log('Hello' + (yield 123)); // OK
}
```

11. yield 语句本身没有返回值，或者说总是返回 undefined。next()方法可以带一个参数，该参数会被当作上一条 yield 语句的返回值。

```js
function* foo(x) {
  var y = 2 * (yield x + 1);
  var z = yield y / 3;
  return x + y + z;
}

var a = foo(5);
console.log(a.next());
console.log(a.next(12));
console.log(a.next(13));
```

12. next()、throw()、return()这三个方法本质上是同一件事，可以放在一起理解。它们的作用都是让 Generator 函数恢复执行，并且使用不同的语句替换 yield 表达式。

```js
const g = function*(x, y) {
  let result = yield x + y;
  return result;
};

const gen = g(1, 2);
gen.next(); // Object {value: 3, done: false}

gen.next(1); // Object {value: 1, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = 1;

gen.throw(new Error('出错了')); // Uncaught Error: 出错了
// 相当于将 let result = yield x + y
// 替换成 let result = throw(new Error('出错了'));

gen.return(2); // Object {value: 2, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = return 2;
```
