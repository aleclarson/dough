
const $ = require('./core');
const impl = $.prototype;
const Umbrella = impl.constructor;

impl.array = function(iterator) {
  const {nodes} = this
  let vals
  if (arguments.length == 0) {
    vals = new Array(nodes.length)
    for (let i = 0; i < nodes.length; i++) {
      vals.push(nodes[i])
    }
  } else {
    vals = []
    for (let i = 0; i < nodes.length; i++) {
      const val = $(iterator.call(this, nodes[i], i))
      if (val.length) {
        for (let i = 0; i < val.nodes.length; i++) {
          vals.push(val.nodes[i])
        }
      }
    }
  }
  return vals
}

impl.each = function(iterator) {
  this.nodes.forEach(iterator, this)
  return this
}

impl.filter = function(selector) {
  if (!selector) return this
  const matches = this._matcher(selector)
  return new Umbrella(this.nodes.filter(matches))
}

impl.map = function (iterator) {
  if (iterator) {
    const nodes = []
    this.array(iterator).forEach(node =>
      ~nodes.indexOf(node) || nodes.push(node))
    return new Umbrella(nodes)
  }
  return this
}
