
const $ = require('./core')
const proto = $.prototype
const Dough = proto.constructor

proto.children = function(selector) {
  const children = this.length == 1 ?
    $(this.nodes[0].childNodes) : this.array(getChildren)
  return selector ? children.filter(selector) : children
}

function getChildren(node) {
  return node.childNodes
}

Object.defineProperty(proto, 'childNodes', {
  get() { return this.nodes[0].childNodes }
})

proto.closest = function(selector, context) {
  const matches = this._matcher(selector)
  return this.map((node, i) => {
    const owner = context || node.ownerDocument
    while (node && node != owner) {
      if (matches(node, i)) return node
      node = node.parentNode
    }
  })
}

proto.contains = function(arg) {
  if (arg) {
    const matches = typeof arg == 'string'
      ? (node) => node.querySelector(arg)
      : (node) => node.contains(arg) && node != arg

    const {nodes} = this
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      if ($.isElem(node) && matches(node)) return true
    }
  }
  return false
}

proto.eq = function(index) {
  const node = this.nodes[index < 0 ? this.length + index : index]
  return node ? new Dough([node]) : $()
}

proto.find = function(selector) {
  const {nodes} = this
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i]
    if ($.isElem(node)) {
      node = node.querySelector(selector)
      if (node) return new Dough([node])
    }
  }
  return $()
}

proto.findAll = function(selector) {
  if (typeof selector != 'string') {
    const matches = this._matcher(selector)
    return this.map(node =>
      $.isElem(node) && node.querySelectorAll('*').filter(matches))
  }
  return this.map(node =>
    $.isElem(node) && node.querySelectorAll(selector))
}

proto.findLast = function(selector) {
  const {nodes} = this
  for (let i = nodes.length; i > 0; i) {
    let node = nodes[--i]
    if ($.isElem(node)) {
      node = last(node.querySelectorAll(selector))
      if (node) return new Dough([node])
    }
  }
  return $()
}

proto.first = function(selector) {
  const {nodes} = this
  if (arguments.length) {
    const matches = this._matcher(selector)
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      if (matches(node, i)) {
        return new Dough([node])
      }
    }
    return $()
  }
  return nodes.length > 1
    ? new Dough([nodes[0]])
    : this
}

Object.defineProperty(proto, 'firstChild', {
  get() { return this.nodes[0].firstChild }
})

Object.defineProperty(proto, 'firstNode', {
  get() { return this.nodes[0] }
})

proto.indexOf = function(arg) {
  return this.nodes.indexOf($(arg).firstNode)
}

const indexOf = Function.call.bind(Array.prototype.indexOf)
Object.defineProperty(proto, 'index', {
  get() {
    const node = this.nodes[0]
    return indexOf(node.parentNode.childNodes, node)
  }
})

proto.last = function(selector) {
  const {nodes} = this
  if (arguments.length) {
    const matches = this._matcher(selector)
    for (let i = nodes.length; i > 0; i) {
      const node = nodes[--i]
      if (matches(node, i)) {
        return new Dough([node])
      }
    }
    return $()
  }
  return nodes.length > 1
    ? new Dough([nodes[nodes.length - 1]])
    : this
}

Object.defineProperty(proto, 'lastChild', {
  get() { return last(this.nodes).lastChild }
})

Object.defineProperty(proto, 'lastNode', {
  get() { return last(this.nodes) }
})

function last(arr) {
  return arr[arr.length - 1]
}

proto.parent = function(selector) {
  if (this.length == 1) {
    const parent = this.parentNode
    if (!$.isElem(parent)) return $()
    return $(selector && !this._matches(selector, parent) ? null : parent)
  } else {
    const parents = this.map(getParent)
    return selector ? parents.filter(selector) : parents
  }
}

function getParent(node) {
  // Avoid document fragments.
  if ($.isElem(node.parentNode)) {
    return node.parentNode
  }
}

Object.defineProperty(proto, 'parentNode', {
  get() {
    const node = this.nodes[0].parentNode
    return $.isElem(node) ? node : null
  }
})

proto.siblings = function(selector) {
  return this.parent().children(selector).not(this)
}
