
const u = require('./core')

u.prototype.addClass = function() {
  return this._eacharg(arguments, addClass)
}

function addClass(node, name) {
  node.classList.add(name)
}

u.prototype.hasClass = function() {
  return this.is('.' + this._args(arguments).join('.'))
}

u.prototype.is = function(selector) {
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

u.prototype.not = function(selector) {
  const {length} = this
  if (length == 1) {
    return this._matches(selector, this.firstNode)
  } else if (length) {
    const matches = this._matcher(selector)
    return this.filter((node, i) => !matches(node, i))
  }
  return this
}

u.prototype.removeClass = function() {
  return this._eacharg(arguments, removeClass)
}

function removeClass(node, name) {
  node.classList.remove(name)
}

u.prototype.toggleClass = function(arg, flag) {
  if (flag === !!flag) {
    return this[flag ? 'addClass' : 'removeClass'](arg)
  }
  return this._eacharg(arg, toggleClass)
}

function toggleClass(node, name) {
  node.classList.toggle(name)
}
