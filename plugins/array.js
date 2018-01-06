
const u = require('./core');
const Umbrella = u.prototype.constructor;

u.prototype.array = function(iterator) {
  if (typeof iterator != 'function') {
    return this.nodes.slice()
  }
  return this.nodes.reduce((arr, node, i) => {
    const res = iterator.call(this, node, i)
    return res ? arr.concat(u(res).nodes) : arr
  }, [])
}

u.prototype.each = function(iterator) {
  this.nodes.forEach(iterator, this)
  return this
}

u.prototype.filter = function(selector) {
  if (!selector) return this
  const matches = this._matcher(selector)
  return new Umbrella(this.nodes.filter(matches))
}

u.prototype.map = function (iterator) {
  if (iterator) {
    const nodes = []
    this.array(iterator).forEach(node =>
      ~nodes.indexOf(node) || nodes.push(node))
    return new Umbrella(nodes)
  }
  return this
}
