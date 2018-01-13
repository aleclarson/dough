
const u = require('./core')
const impl = u.prototype

impl.addClass = function() {
  return this._apply(u._splitReduce(arguments), addClass)
}

function addClass(node, name) {
  node.classList.add(name)
}

// Perf comparison: https://jsperf.com/does-class-exist
impl.hasClass = function() {
  const node = this.nodes[0]
  if (!node) return false
  const names = u._splitReduce(arguments)
  for (let i = 0; i < names.length; i++) {
    if (!node.classList.contains(names[i])) return false
  }
  return true
}

impl.is = function(selector) {
  const {length} = this
  if (length == 1) {
    return this._matches(selector, this.firstNode)
  } else if (length) {
    const matches = this._matcher(selector)
    for (let i = 0; i < this.nodes.length; i++) {
      if (matches(this.nodes[i], i)) return true
    }
  }
  return false
}

impl.not = function(selector) {
  const {length} = this
  if (length == 1) {
    return this._matches(selector, this.firstNode)
  } else if (length) {
    const matches = this._matcher(selector)
    return this.filter((node, i) => !matches(node, i))
  }
  return this
}

impl.removeClass = function() {
  return this._apply(u._splitReduce(arguments), removeClass)
}

function removeClass(node, name) {
  node.classList.remove(name)
}

impl.toggleClass = function(arg, flag) {
  if (flag === !!flag) {
    return this[flag ? 'addClass' : 'removeClass'](arg)
  }
  return this._apply(u._splitReduce(arg), toggleClass)
}

function toggleClass(node, name) {
  node.classList.toggle(name)
}
