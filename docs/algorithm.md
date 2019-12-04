### 二叉树的遍历

二叉树的遍历可以分为深度遍历和广度遍历， 深度遍历有前序、中序和后序三种遍历方法。 广度遍历就是层次遍历。

```js
// 深度遍历
var preOrderRec = function (node) {
  var arr = []
  function _fn (node) {
    if (node) {
      arr.push(node.value) // 前序遍历
      _fn(node.left)
      // arr.push(node.value) // 中序遍历
      _fn(node.right)
      // arr.push(node.value) // 后序遍历
    }
  }
  _fn(node)
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
#### 从左往右看二叉树
衍生题：从左往右看二叉树，求看到的字母。思路：将二叉树分层，每层最左边的字母，就是能不看到的字母，提到分层从而想到广度遍历，在广度遍历中加入层数信息，最后遍历得到数组，取出每层的第一个。
```js
function leftSee (node) {
  var res = []
  function traveral (node) {
    var arr = []
    if (node) {
      var que = [{ node: node, cenNo: 0 }]
      while (que.length !== 0) {
        var item = que.shift()
        arr.push({ value: item.node.value, cenNo: item.cenNo })
        var cen = item.cenNo + 1
        if (item.node.left) que.push({ node: item.node.left, cenNo: cen })
        if (item.node.right) que.push({ node: item.node.right, cenNo: cen })
      }
    }
    return arr
  }
  var temp = traveral(node)
  var no = 0 // 层数
  for (var i = 0; i < temp.length; i++) {
    if (no === temp[i].cenNo) {
      res.push(temp[i].value)
      no++
    }
  }
  return res
}
console.log(leftSee(tree))
```

### 单链表去除倒数第n项
思路：利用**双指针解法**（前指针、后指针），让前指针先走n步，再让两个在指针同时后移，直到前指针到达尾部，此时，后指针的下一个节点就是要被删除的节点了。
```js
var a = { value: 'a', next: { value: 'a', next: { value: 'c', next: { value: 'd', next: null } } } }
var removeNthFromEnd = function (head, n) {
  let first = head, second = head
  while (n > 0) {
    first = first.next
    n--
  }
  // 删除的是头节点
  if (!first) return head.next
  while (first.next) {
    first = first.next
    second = second.next
  }
  // 修改指向，即删除目标项
  second.next = second.next.next
  return head
}
console.log(removeNthFromEnd(a, 2))
// { value: 'a', next: { value: 'a', next: { value: 'd', next: null } } }
```