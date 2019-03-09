var status = Symbol('status')

function Promise () {
  var self = this
  self.status = 'pedding'
  self.data = undefined
  self.onResolvedCallback = []
  self.onRejectedCallback = []
  function resolve (value) {
    if (self.status === 'pending') {
      self.status = 'resolved'
      self.data = value
      for (var i = 0; i < self.onResolvedCallback.length; i++) {
        self.onResolvedCallback[i](value)
      }
    }
  }

  function reject (reason) {
    if (self.status === 'pending') {
      self.status = 'rejected'
      self.data = reason
      for (var i = 0; i < self.onRejectedCallback.length; i++) {
        self.onRejectedCallback[i](reason)
      }
    }
  }
  try {
    executor(resolve, reject)
  } catch (e) {
    reject(e)
  }
}
function executor () {}
