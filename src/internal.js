
const $ = require('./core')
const noop = require('noop')
const isObject = require('is-object')

const proto = $.prototype

// Non-standard names are still required. 😳
const nodeMatches = Function.call.bind(
  Element.prototype.matches ||
  Element.prototype.msMatchesSelector ||
  Element.prototype.webkitMatchesSelector
)

// For every item in the given array, call the
// iterator once per matched node.
proto._apply = function(values, iterator) {
  const {nodes} = this
  if (nodes.length) {
    for (let i = 0; i < values.length; i++) {
      const value = values[i]
      for (let j = 0; j < nodes.length; j++) {
        iterator.call(this, nodes[j], value)
      }
    }
  }
  return this
}

proto._matcher = function(selector) {
  if (typeof selector == 'string') {
    return (node) => node.nodeType == 1 && nodeMatches(node, selector)
  }
  if (typeof selector == 'function') {
    return selector
  }
  if ($.is(selector)) {
    const {nodes} = selector
    return (node) => nodes.indexOf(node) != -1
  }
  return noop.false
}

proto._matches = function(selector, node) {
  if (typeof selector == 'string') {
    return node.nodeType == 1 && nodeMatches(node, selector)
  }
  if (typeof selector == 'function') {
    return selector(node, 0)
  }
  if ($.is(selector)) {
    return selector.nodes.indexOf(node) > -1
  }
  return false
}

proto._pairs = function(args, proto) {
  const {nodes} = this
  let prop = args[0]
  if (nodes.length) {
    let value = args[1]
    if (typeof prop == 'string') {
      if (args.length == 1) {
        return proto.get(nodes[0], prop)
      }
      proto.set(nodes, prop, value)
    }
    else if (isObject(prop)) {
      const values = prop
      for (prop in values) {
        value = values[prop]
        proto.set(nodes, prop, value)
      }
    }
  }
  else if (typeof prop == 'string') {
    if (args.length == 1) return
  }
  return this
}
