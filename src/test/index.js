async function async1 () {
  console.log('async1_start_2')
  await async2()
  console.log('async1_end_6')
  return 'async_return_8'
}

async function async2 () {
  console.log('async2_3')
}

console.log('script_start_1')

setTimeout(function () {
  console.log('setTimeout_9')
}, 0)

async1().then(function (message) { console.log(message) })

new Promise(function (resolve) {
  console.log('promise_4')
  resolve()
}).then(function () {
  console.log('promise_7')
})

console.log('script_end_5')
