/**
          a
    b            c
d       e      f   g
      h   i
 */
var tree = {
  value: "a",
  left: {
    value: "b",
    left: {
      value: "d",
    },
    right: {
      value: "e",
      left: {
        value: "h",
      },
      right: {
        value: "i",
      },
    },
  },
  right: {
    value: "c",
    left: {
      value: "f",
    },
    right: {
      value: "g",
    },
  },
};

// 深度遍历
function fn (node) {
  var arr = [];
  function _fn(n) {
    if (n) {
      arr.push(n.value)
      _fn(n.left)
      _fn(n.right)
    }
  }
  _fn(node)
  return arr;
}

function fn2 (node) {
  var arr = []
  if (node) {
    var stack = [node] // 入栈
    while(stack.length > 0) {
      var item = stack.pop() // 出栈
      arr.push(item.value) // doing
      if (item.right) stack.push(item.right)
      if (item.left) stack.push(item.left)
    }
  }
  return arr
}

// 广度遍历
function fn3 (node) {
  var arr = []
  if (node) {
    var stack = [node]
    while(stack.length > 0) {
      var item = stack.shift() // 出栈
      arr.push(item.value)
      if(item.left) stack.push(item.left)
      if(item.right) stack.push(item.right)
    }
  }
  return arr
}

function search (arr, item) {
  var low = 0
  var high = arr.length - 1
  while (low <= high) {
    var mid = Math.floor((low + high)/ 2)
    var i = arr[mid]
    if (i === item) {
      return mid
    } else if (i > item){
      high = mid  - 1
    } else {
      low = mid + 1
    }
  }
  return -1
}
console.log(search([1,3,4,5,6,7,8,9], 3))


function getRes (n, k) {
  var sel = [...(new Array(n)).keys()]
  sel.shift()
  var res = []
  function backtrack(path, selects) {
      if (path.length === k) {
          res.push(JSON.parse(JSON.stringify(path)))
          return
      }
      selects.forEach((select, index) => {
          path.push(select) // 做选择
          var temp = JSON.parse(JSON.stringify(selects))
          temp.splice(index, 1)
          backtrack(path, temp)
          path.pop() // 撤销选择
      });
  }
  backtrack([], sel)
  return res
}

getRes(4, 2)

function getResult (n, k) {
  res = []
  path = []
  
  function backtrack(idx) {
    
    if (path.length === k) {
      res.push(path.slice())
      return
    }
    if (idx === n + 1) {
      return
    }
    path.push(idx)
    backtrack(idx + 1)
    path.pop()
  }

  backtrack(1)
  return res
}