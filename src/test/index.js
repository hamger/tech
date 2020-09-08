
var p = new Promise((resolve, reject) => {
  resolve('hello_6')
  console.log('1')
})

function hello () {
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

function test1 () {
  console.log('test1_5')
}

async function asy () {
  console.log('asy_begins_3')
  await console.log('asy_4')

  console.log('async_8')
  await console.log('asy_9')

  console.log('asy_ends_12')
}

asy()

test1()
