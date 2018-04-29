
const isObject = require('is-object');

const u = require('./core');
const impl = u.prototype;
const Umbrella = impl.constructor;

impl.clone = function(attrs) {
  if (attrs != null && !isObject(attrs)) {
    throw TypeError('Expected an object or undefined')
  }
  return this.length == 1 ? new Umbrella([
    clone(this.firstNode, attrs)
  ]) : this.map(node => clone(node, attrs))
}

function clone(node, attrs) {
  const clone = node.cloneNode(true)
  if (attrs) u._initAttributes(clone, attrs)
  mirror(node, clone)

  // Mirror every descendant node.
  const nodes = u._select('*', nodes)
  u._select('*', clone).forEach((dest, i) => mirror(nodes[i], dest))
  return clone
}

impl.mirror = mirror
function mirror(src, dest) {
  for (let key in mirror) {
    mirror[key](src, dest)
  }
}

mirror.input = function(src, dest) {
  const tag = src.tagName
  // Values of these nodes are not copied by `cloneNode`
  if (tag == 'SELECT' || tag == 'TEXTAREA') {
    dest.value = src.value
  }
}

mirror.events = function(src, dest) {
  if (src._e) {
    dest._e = {}
    const eventIds = Object.keys(src._e)
    for (let i = 0; i < eventIds.length; i++) {
      const eventId = eventIds[i]
      const srcListeners = src._e[eventId]
      const destListeners = []
      for (let j = 0; j < srcListeners.length; j++) {
        const listener = srcListeners[j]
        node.addEventListener(eventId, listener, listener._captures)
        destListeners.push(listener)
      }
      dest._e[eventId] = destListeners
    }
  }
}
