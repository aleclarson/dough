
const u = require('./core');
const impl = u.prototype;

impl.attr = function() {
  return this._pairs(arguments, attrFns)
};

Object.defineProperty(impl, 'bounds', {
  get() { return this.nodes[0].getBoundingClientRect() }
});

// Handle data-* attributes for the matched elements
impl.data = function() {
  return this._pairs(arguments, dataFns)
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

const attrFns = {
  get(node, attr) {
    return node.getAttribute(attr)
  },
  set(nodes, attr, value) {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute(attr, value)
    }
  }
}

const dataFns = {
  get(node, name) {
    return node.getAttribute('data-' + name)
  },
  set(nodes, name, value) {
    attrFns.set(nodes, 'data-' + name, value)
  }
}
