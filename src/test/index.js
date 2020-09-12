
// var p = new Promise((resolve, reject) => {
//     resolve('hello_6')
//     console.log('1')
// })

// function hello() {
//     console.log('hello_begins_2')
//     return p
// }

// hello().then(res => {
//     console.log(res)
//     console.log('hello_7')
//     return 'hello_10'
// }).then(res => {
//     console.log(res)
//     console.log('hello_11')
//     return 'hello_13'
// }).then(res => {
//     console.log(res)
//     console.log('hello_14')
// })

// function test1() {
//     console.log('test1_5')
// }

// async function asy() {
//     console.log('asy_begins_3')
//     await console.log('asy_4')

//     console.log('async_8')
//     await console.log('asy_9')

//     console.log('asy_ends_12')
// }

// asy()

// test1()
// /**
//  * @param {number} n
//  * @param {number} k
//  * @return {number[][]}
//  */
var combine = function (n, k) {
  var res = []
  var selects = new Array(n).fill(1).map((item, index) => index)
  function dfs (path, selects) {
    if (path.length === k) {
      res.push(JSON.parse(JSON.stringify(path)))
      return
    }
    selects.forEach((item, index) => {
      path.push(item)
      dfs(path, selects.filter((item, index2) => {
        return index2 !== index
      }))
      path.pop()
    })
  }
  dfs([], selects)
  return res
}
console.log(combine(4, 2))

const listData = [
  { id: 1001, parentId: 0, name: 'AA' },
  { id: 1002, parentId: 1001, name: 'BB' },
  { id: 1003, parentId: 1001, name: 'CC' },
  { id: 1004, parentId: 1003, name: 'DD' },
  { id: 1005, parentId: 1003, name: 'EE' },
  { id: 1006, parentId: 1002, name: 'FF' },
  { id: 1007, parentId: 1002, name: 'GG' },
  { id: 1008, parentId: 1004, name: 'HH' },
  { id: 1009, parentId: 1005, name: 'II' },
  { id: 1010, parentId: 0, name: 'JJ' },
]

function printTree (list) {
  var tree = []
  function getTree (list, tree) {
    if (!list || list.length === 0) return
    if (tree.length === 0) {
      var roots = list.filter(item => item.parentId === 0).map(item => {
        item.layerNo = 0
        return item
      })
      tree.push(...roots)
    }
    tree.forEach(node => {
      var qianzhui = new Array(node.layerNo).fill('&nbsp;')
      console.log(`${qianzhui.join('')}${node.name}`)
      var childrens = list.filter(item => item.parentId === node.id)
      node.children = childrens.map(item => {
        item.layerNo = node.layerNo + 1
        return item
      })
      if (node.children.length > 0) getTree(list.filter(item => item.parentId !== node.id), node.children)
    })
  }
  getTree(list, tree)
}
printTree(listData)
