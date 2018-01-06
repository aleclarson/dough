
const u = require('./core');
const impl = u.prototype;
const isObject = require('is-object');

impl.attr = function() {
  const {nodes} = this
  let name = arguments[0]
  let value = arguments[1]
  if (typeof name == 'string') {
    if (arguments.length == 1) {
      if (nodes.length == 0) return
      return nodes[0].getAttribute(name)
    }
    if (nodes.length && typeof value != 'undefined') {
      setAttribute(nodes, name, value)
    }
  } else if (nodes.length && isObject(name)) {
    const values = name
    for (name in values) {
      value = values[name]
      setAttribute(nodes, name, value)
    }
  }
  return this
};

Object.defineProperty(impl, 'bounds', {
  get() { return this.nodes[0].getBoundingClientRect() }
});

// Handle data-* attributes for the matched elements
impl.data = function(name, value) {
  return this.attr('data-' + name, value);
};

impl.prop = function(name, value) {
  const {nodes} = this
  if (arguments.length == 2) {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i][name] = value
    }
    return this
  }
  if (nodes.length) {
    return nodes[0][name]
  }
};

//
// Helpers
//

function setAttribute(nodes, name, value) {
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].setAttribute(name, value)
  }
}
