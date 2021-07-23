### 冒泡排序

```js
var examplearr = [8, 94, 15, 88, 55, 76, 21, 39];
function sortarr(arr) {
  for (var i = 0; i < arr.length - 1; i++) {
    for (var j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}
console.log(sortarr(examplearr));
```

第一轮排序（i=0）从 j=0 执行到 j=6，将最大的数排到了最后；
第二轮排序（i=1），由于最大的数已经在最后了，没有必要去比较数组的最后两项，所以有`j < arr.length - 1 - i`；
以此类推，每次将剩下数组里面最大的一个数排到最后面，最后一轮排序（i=6），只需要比较数组的第一和第二项。

[js 十大排序算法详解](https://www.cnblogs.com/liyongshuai/p/7197962.html)

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
```
深度遍历采用**栈**，广度遍历采用**队列**。
```js
// 广度遍历
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
```
#### 从左往右看二叉树
衍生题：从左往右看二叉树，求看到的字母。思路：将二叉树分层，每层最左边的字母，就是能看到的字母，提到分层从而想到广度遍历，在广度遍历中加入层数信息，最后遍历得到数组，取出每层的第一个。
```js
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
```
### 多叉树遍历
多叉树递归遍历模板如下：
```js
function traverseNode (node) {
  if (!node) return
  if (node.children && node.children.length > 0) {
      for (let i = 0; i < node.children.length; i++) {
          // 前序遍历需要的操作
          traverseNode(node.children[i]);
          // 后序遍历需要的操作
      }
  }
}
```

### 回溯算法
回溯算法三要素：
* 路径：也就是已经做出的选择。
* 选择列表：也就是你当前可以做的选择。
* 结束条件：也就是到达决策树底层，无法再做选择的条件。
```js
function getResult(sel, target) {
    var res = []
    // 路径：path，选择列表：selects
    function backtrack(path, selects) {
        if (满足结束条件) { // 和 target 有关的结束条件
            res.push(JSON.parse(JSON.stringify(path)))
            return
        }
        selects.forEach((select, index) => {
            path.push(select) // 做选择
            // 修正选择后的选择列表，递归
            var temp = JSON.parse(JSON.stringify(selects))
            temp.splice(index, 1)
            backtrack(path, tmp)
            path.pop() // 撤销选择
        });
    }
    backtrack([], sel)
    return res
}
```
#### 求全排列
给定一个没有重复数字的序列，返回其所有可能的全排列。
```js
实例:
输入: [1,2,3]
输出:
[
  [1,2,3],
  [1,3,2],
  [2,1,3],
  [2,3,1],
  [3,1,2],
  [3,2,1]
]
```
基于回溯算法，函数编写如下
```js
function permute (arr) {
	var res = []
	// nums：选择；track：路径；
	function backtrack (nums, track) {
		if (track.length === nums.length) {
			// 需要克隆结果，避免引用类型的影响
			res.push(JSON.parse(JSON.stringify(track)))
			return
		}
		for (var i = 0;i < nums.length;i++) {
			// 排除在路径里的选择
			if (track.indexOf(nums[i]) > -1) {
				continue
			} 
			track.push(nums[i])
			backtrack(nums, track)
			track.pop()
		}
	}
	backtrack(arr, [])
	return res
}
permute([1,2,3])
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
