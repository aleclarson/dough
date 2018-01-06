
const u = require('./core')

const isPromise = require('is-promise')
const noop = require('noop')

let i = -1
const queue = []

u.ready = function(fn) {
  if (typeof fn == 'function') {
    queue.push(fn)
  }
}

if (document.readyState == 'complete') {
  setTimeout(dequeue)
} else {
  window.addEventListener('load', onReady)
  document.addEventListener('DOMContentLoaded', onReady)
  function onReady() {
    window.removeEventListener('load', onReady)
    document.removeEventListener('DOMContentLoaded', onReady)
    setTimeout(dequeue)
  }
}

function dequeue() {
  if (++i < queue.length) {
    try {
      const res = queue[i]()
      if (isPromise(res)) {
        res.then(dequeue, console.error)
      } else {
        dequeue()
      }
    } catch(e) {
      console.error(e)
    }
  } else {
    u.ready = noop
  }
}
