/**
          a
    b            c
d       e      f   g
      h   i
 */
var tree = {
  value: 'a',
  left: {
    value: 'b',
    left: {
      value: 'd',
    },
    right: {
      value: 'e',
      left: {
        value: 'h',
      },
      right: {
        value: 'i',
      }
    }
  },
  right: {
    value: 'c',
    left: {
      value: 'f',
    },
    right: {
      value: 'g',
    }
  }
}

// 先序遍历
console.log('↓---先序遍历---↓')
var preOrderRec = function (node) {
  var arr = []
  function _fn(node) {
    if (node) {
      arr.push(node.value)
      _fn(node.left)
      _fn(node.right)
    }
  }
  _fn(node)
  return arr
}
console.log(preOrderRec(tree))
// [ 'a', 'b', 'd', 'e', 'h', 'i', 'c', 'f', 'g' ]

var preOrderUnRecursion = function (node) {
  var arr = [] // 定义保存先序遍历结果的数组
  if (node) {
    var stack = [node] // 将二叉树压入栈
    while (stack.length !== 0) { // 如果栈不为空，则循环遍历
      node = stack.pop() // 从栈中取出一个节点(先进后出，是栈)
      arr.push(node.value) // 将取出节点的值存入数组中
      // 因为栈是先进后出，想要先获得左节点的值，就应该先把右节点压入栈中 
      if (node.right) stack.push(node.right) // 如果存在右子树，将右子树压入栈
      if (node.left) stack.push(node.left) // 如果存在左子树，将左子树压入栈
    }
  }
  return arr
}
console.log(preOrderUnRecursion(tree))

// 中序遍历
console.log('↓---中序遍历---↓')
var inOrderRec = function (node) {
  var arr = []
  function _fn(node) {
    if (node) {
      _fn(node.left)
      arr.push(node.value)
      _fn(node.right)
    }
  }
  _fn(node)
  return arr
}
console.log(inOrderRec(tree))
// [ 'd', 'b', 'h', 'e', 'i', 'a', 'f', 'c', 'g' ]

var inOrderUnRec = function (node) {
  var arr = [] // 定义保存中序遍历结果的数组
  if (node) { // 判断二叉树是否为空
    var stack = [] // 建立一个栈
    while (stack.length !== 0 || node) { // 如果栈不为空或节点不为空，则循环遍历
      if (node) { // 如果节点不为空
        stack.push(node) // 将节点压入栈
        node = node.left // 将左子树作为当前节点
      } else { // 左子树为空，即没有左子树的情况
        node = stack.pop() // 将节点取出来
        arr.push(node.value) // 将取出节点的值存入数组中
        node = node.right // 将右节点作为当前节点
      }
    }
  }
  return arr
}
console.log(inOrderUnRec(tree))

// 后序遍历
console.log('↓---后序遍历---↓')
var postOrderRec = function (node) {
  var arr = []
  function _fn(node) {
    if (node) {
      _fn(node.left)
      _fn(node.right)
      arr.push(node.value)
    }
  }
  _fn(node)
  return arr
}
console.log(postOrderRec(tree))
// [ 'd', 'h', 'i', 'e', 'b', 'f', 'g', 'c', 'a' ]
var postOrderUnRec = function (node) {
  var arr = [] // 定义保存后序遍历结果的数组
  if (node) { // 判断二叉树是否为空
    var stack = [node] // 将二叉树压入栈
    var tmp = null // 定义缓存变量
    while (stack.length !== 0) { // 如果栈不为空，则循环遍历
      tmp = stack[stack.length - 1] // 将栈顶的值保存在tmp中
      if (tmp.left && node !== tmp.left && node !== tmp.right) { // 如果存在左子树
        stack.push(tmp.left) // 将左子树节点压入栈
      } else if (tmp.right && node !== tmp.right) { // 如果节点存在右子树
        stack.push(tmp.right) // 将右子树压入栈中
      } else {
        arr.push(stack.pop().value)
        node = tmp
      }
    }
  }
  return arr
}
console.log(postOrderUnRec(tree))

// 层次遍历
console.log('↓---层次遍历---↓')
var breadthTraversal = function (node) {
  var arr = [] // 定义保存广度遍历结果的数组
  if (node) { // 判断二叉树是否为空
    var que = [node] // 将二叉树放入队列
    while (que.length !== 0) { // 判断队列是否为空
      node = que.shift() // 从队列中取出一个节点（先进先出，队列）
      arr.push(node.value) // 将取出节点的值保存到数组
      if (node.left) que.push(node.left) // 如果存在左子树，将左子树放入队列
      if (node.right) que.push(node.right) // 如果存在右子树，将右子树放入队列
    }
  }
  return arr
}
console.log(breadthTraversal(tree))

console.log('↓---从左往右看二叉树---↓')
// 衍生题，从左往右看二叉树，求看到的字母。思路：将二叉树分层，每层最左边的字母，就是能不看到的字母，提到分层从而想到广度遍历
function leftSee(node) {
  var res = []
  if (node) {
    var que = [{ node: node, layerNo: 0 }]
    while (que.length !== 0) {
      const { node, layerNo } = que.shift()
      if (!res[layerNo] && res[layerNo] !== 0) res[layerNo] = node.value
      var cen = layerNo + 1
      if (node.left) que.push({ node: node.left, layerNo: cen })
      if (node.right) que.push({ node: node.right, layerNo: cen })
    }
  }
  return res
}
console.log(leftSee(tree))

console.log('↓---单链表去除倒数第n项---↓')
var a = { value: 'a', next: { value: 'a', next: { value: 'c', next: { value: 'd', next: null } } } }

// 思路：利用双指针解法（前指针、后指针），让前指针先走n步，再让两个在指针同时后移，直到前指针到达尾部，此时，后指针的下一个节点就是要被删除的节点了。

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
