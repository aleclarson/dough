
const u = require('./core');
const noop = require('noop');

const impl = u.prototype;

// Non-standard names are still required. 😳
const nodeMatches = Function.call.bind(
  Element.prototype.matches ||
  Element.prototype.msMatchesSelector ||
  Element.prototype.webkitMatchesSelector
);

// For every item in the given array, call the
// iterator once per matched node.
impl._apply = function(values, iterator) {
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
