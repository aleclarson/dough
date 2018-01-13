
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

impl.prop = function(prop, value) {
  const {nodes} = this
  if (arguments.length == 2) {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i][prop] = value
    }
    return this
  }
  if (nodes.length) {
    return nodes[0][prop]
  }
};

impl.cache = function() {
  if (arguments.length == 0) {
    return cacheFns.get(this.nodes[0])
  }
  return this._pairs(arguments, cacheFns)
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

const CACHE_KEY = Symbol()
const cacheFns = {
  get(node, key) {
    let cache = node[CACHE_KEY]
    if (!cache) node[CACHE_KEY] = cache = Object.create(null)
    return key ? cache[key] : cache
  },
  set(nodes, key, value) {
    for (let i = 0; i < nodes.length; i++) {
      const cache = cacheFns.get(nodes[i])
      cache[key] = value
    }
  }
}
