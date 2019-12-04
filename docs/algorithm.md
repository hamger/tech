### 二叉树的遍历

二叉树的遍历可以分为深度遍历和广度遍历， 深度遍历有前序、中序和后序三种遍历方法。 广度遍历就是层次遍历。

```js
// 深度遍历
var preOrderRec = function (node) {
  var arr = []
  if (node) {
    arr.push(node.value) // 前序遍历
    preOrderRec(node.left)
    preOrderRec(node.right)
  }
  return arr
}
var inOrderRec = function (node) {
     var arr = []
  if (node) {
    inOrderRec(node.left)
    arr.push(node.value) // 中序遍历
    inOrderRec(node.right)
  }
  return arr
}
var postOrderRec = function (node) {
    var arr = []
  if (node) {
    postOrderRec(node.left)
    postOrderRec(node.right)
    arr.push(node.value) // 后序遍历
  }
  return arr
}
```
深度遍历使用递归来写更简洁，本质上是利用了栈的数据结构，所有递归都可以使用栈来写，以下用先序遍历为例：
```js
// 先序遍历-非递归版本
var preListUnRec = []
var preOrderUnRecursion = function (node) {
  if (node) {
    var stack = [node] // 将二叉树压入栈
    while (stack.length !== 0) { // 如果栈不为空，则循环遍历
      node = stack.pop() // 从栈中取出一个节点(先进后出，是栈)
      preListUnRec.push(node.value) // 将取出节点的值存入数组中
      // 因为栈是先进后出的，想要先获得左节点的值，则先把右节点压入栈中 
      if (node.right) stack.push(node.right) // 如果存在右子树，将右子树压入栈
      if (node.left) stack.push(node.left) // 如果存在左子树，将左子树压入栈
    }
  }
}
```
深度遍历采用**栈**，广度遍历采用**队列**。
```js
// 广度遍历
var breadthList = []
var breadthTraversal = function (node) {
    if (node) {
        var stack = [node]
        while(stack.length !== 0) {
            node = stack.shift() // 从队列中取出一个节点(先进先出，是队列)
            breadthList.push(node.value)
            // 因为队列是先进先出的，想要先获得左节点的值，则先把左节点推入队列中 
            if (node.left) stack.push(node.left)
            if (node.right) stack.push(node.right)
        }
    }
}
```