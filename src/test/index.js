// 函数节流（A事件执行后的时间 T 内不再重复执行）
function throttle(fn, time=500) {
    var canrun = true
    return function (...args) {
        if (!canrun) return
        canrun = false
        fn.apply(this, args)
        setTimeout(() => {
            canrun = true
        }, time)
    }
}

// 防抖，时间 T 后执行函数，若期间有调用，则重新计时
function debounce(fn, time=500) {
    var timer = null
    return function (...args) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, time)
    }
}