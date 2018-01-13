
const isObject = require('is-object');

const u = require('./core');
const impl = u.prototype;

impl.clone = function(attrs) {
  const hasAttrs = isObject(attrs)
  return this.map(node => {
    const clone = node.cloneNode(true)
    mirror(node, clone)

    // Set attributes on the root node(s).
    if (hasAttrs) {
      u._setAttrs(clone, attrs)
    }

    // Mirror every descendant node.
    const nodes = u._select('*', nodes)
    u._select('*', clone).forEach((dest, i) => mirror(nodes[i], dest))
    return clone
  })
};

impl.mirror = mirror
function mirror(src, dest) {
  for (let key in mirror) {
    mirror[key](src, dest)
  }
}

// Nodes with these tag names are not copied properly by `cloneNode`
const inputRE = /^(SELECT|TEXTAREA)$/

mirror.input = function(src, dest) {
  if (brokenTagRE.test(src.tagName)) {
    dest.value = src.value
  }
}

mirror.events = function(src, dest) {
  const listeners = src._e
  if (listeners) {
    dest._e = {}
    for (let eventId in listeners) {
      dest._e[eventId] = []
      listeners[eventId].forEach(listener => {
        node.addEventListener(eventId, listener, listener._captures)
        dest._e[eventId].push(listener)
      })
    }
  }
}
