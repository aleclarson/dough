
const $ = require('./core')
const proto = $.prototype

proto.addClass = function() {
  return this._apply($._splitReduce(arguments), addClass)
}

function addClass(node, name) {
  node.classList.add(name)
}

// Perf comparison: https://jsperf.com/does-class-exist
proto.hasClass = function() {
  const node = this.nodes[0]
  if (!node) return false
  const names = $._splitReduce(arguments)
  for (let i = 0; i < names.length; i++) {
    if (!node.classList.contains(names[i])) return false
  }
  return true
}

proto.is = function(selector) {
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

proto.not = function(selector) {
  const {length} = this
  if (length == 1) {
    return this._matches(selector, this.firstNode)
  } else if (length) {
    const matches = this._matcher(selector)
    return this.filter((node, i) => !matches(node, i))
  }
  return this
}

proto.removeClass = function() {
  return this._apply($._splitReduce(arguments), removeClass)
}

function removeClass(node, name) {
  node.classList.remove(name)
}

proto.toggleClass = function(arg, flag) {
  if (flag === !!flag) {
    return this[flag ? 'addClass' : 'removeClass'](arg)
  }
  return this._apply($._splitReduce(arg), toggleClass)
}

function toggleClass(node, name) {
  node.classList.toggle(name)
}
