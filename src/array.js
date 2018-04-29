
const $ = require('./core');
const proto = $.prototype;
const Dough = proto.constructor;

proto.array = function(iterator) {
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

proto.each = function(iterator) {
  this.nodes.forEach(iterator, this)
  return this
}

proto.filter = function(selector) {
  if (!selector) return this
  const matches = this._matcher(selector)
  return new Dough(this.nodes.filter(matches))
}

proto.map = function (iterator) {
  if (iterator) {
    const nodes = []
    this.array(iterator).forEach(node =>
      ~nodes.indexOf(node) || nodes.push(node))
    return new Dough(nodes)
  }
  return this
}
