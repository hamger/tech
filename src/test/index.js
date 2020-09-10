
var p = new Promise((resolve, reject) => {
    resolve('hello_6')
    console.log('1')
})

function hello() {
    console.log('hello_begins_2')
    return p
}

hello().then(res => {
    console.log(res)
    console.log('hello_7')
    return 'hello_10'
}).then(res => {
    console.log(res)
    console.log('hello_11')
    return 'hello_13'
}).then(res => {
    console.log(res)
    console.log('hello_14')
})

function test1() {
    console.log('test1_5')
}

async function asy() {
    console.log('asy_begins_3')
    await console.log('asy_4')

    console.log('async_8')
    await console.log('asy_9')

    console.log('asy_ends_12')
}

asy()

test1()
/**
 * @param {number} n
 * @param {number} k
 * @return {number[][]}
 */
var combine = function (n, k) {
    var res = []
    function dfs(path, index) {
        if (path.length === k) {
            res.push(JSON.parse(JSON.stringify(path)))
            return
        }
        for (var i = index; i <= n; i++) {
            path.push(i)
            dfs(path, i)
            path.pop()
        }
    }
    dfs([], 0)
    return res
};
console.log(combine(4, 2))
