
const $ = require('./core');
const proto = $.prototype;

proto.attr = function() {
  return this._pairs(arguments, attrFns)
};

Object.defineProperty(proto, 'bounds', {
  get() { return this.nodes[0].getBoundingClientRect() }
});

// Handle data-* attributes for the matched elements
proto.data = function() {
  return this._pairs(arguments, dataFns)
};

proto.prop = function(prop, value) {
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

proto.cache = function() {
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
    return node.getAttribute($.kebab(attr))
  },
  set(nodes, attr, value) {
    if (value !== undefined) {
      attr = $.kebab(attr)
      const removed = value === null
      for (let i = 0; i < nodes.length; i++) {
        if (removed) {
          nodes[i].removeAttribute(attr)
        } else {
          nodes[i].setAttribute(attr, value)
        }
      }
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
