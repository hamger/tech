var btn = document.getElementById('btn')

var time = 0
btn.addEventListener('click', () => {
  time = Date.now()
  requestAnimationFrame(() => {
    console.log(2)
  })
  setTimeout(() => console.log(3))
  aa()
})

function aa () {
  console.log(1)
  Promise.resolve().then(() => {
    if (Date.now() - time > 70) {
      console.log(0)
    } else {
      aa()
    }
  })
}
