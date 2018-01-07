
const u = require('./core')
const impl = u.prototype

impl.addClass = function() {
  return this._eachArg(arguments, addClass)
}

function addClass(node, name) {
  node.classList.add(name)
}

impl.hasClass = function() {
  return this.is([''].concat(u._splitArgs(arguments)).join('.'))
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
  return this._eachArg(arguments, removeClass)
}

function removeClass(node, name) {
  node.classList.remove(name)
}

impl.toggleClass = function(arg, flag) {
  if (flag === !!flag) {
    return this[flag ? 'addClass' : 'removeClass'](arg)
  }
  return this._eachArg(arg, toggleClass)
}

function toggleClass(node, name) {
  node.classList.toggle(name)
}
