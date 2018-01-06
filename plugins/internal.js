
const u = require('./core');
const noop = require('noop');

const impl = u.prototype;

// Non-standard names are still required. 😳
const nodeMatches = Function.call.bind(
  Element.prototype.matches ||
  Element.prototype.msMatchesSelector ||
  Element.prototype.webkitMatchesSelector
);

impl._args = function(args) {
  if (Array.isArray(args)) {
    return args
  }
  if (typeof args == 'string') {
    return splitString(args)
  }
  return u._slice(args).map(splitString)
}

// Split by whitespace
function splitString(str) {
  return str.trim().split(/ +/)
}

impl._eacharg = function(args, iterator) {
  const {nodes} = this
  if (nodes.length) {
    this._args(args).forEach(arg => {
      for (let i = 0; i < nodes.length; i++) {
        iterator.call(this, nodes[i], arg)
      }
    })
  }
  return this
}

impl._matcher = function(selector) {
  if (typeof selector == 'string') {
    return (node) => node.nodeType == 1 && nodeMatches(node, selector)
  }
  if (typeof selector == 'function') {
    return selector
  }
  if (u.is(selector)) {
    const {nodes} = selector
    return (node) => nodes.indexOf(node) != -1
  }
  return noop.false
}

impl._matches = function(selector, node) {
  if (typeof selector == 'string') {
    return node.nodeType == 1 && nodeMatches(node, selector)
  }
  if (typeof selector == 'function') {
    return selector(node, 0)
  }
  if (u.is(selector)) {
    return selector.nodes.indexOf(node) > -1
  }
  return false
}
