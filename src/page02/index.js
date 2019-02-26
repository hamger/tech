import './index.scss'
document.write('<h1>page02</h1>')

function curry (fn) {
  var arg = []
  return function () {
    console.log(arg)
    if (arg.length === 3) return fn.apply(this, arg)
    arg.concat([].slice.(arguments))
    return this
    // return arguments.callee
  }
}

function add (a, b, c) {
  return a + b + c
}

var newAdd = curry(add)
var res = newAdd(1, 3)(2)
console.log(res)

function foo () {
  console.log('foo')
  Promise.resolve().then(foo)
}
foo()
function bar () {
  console.log('bar')
  setTimeout(bar)
}
bar()
// 一直输出 'foo'
