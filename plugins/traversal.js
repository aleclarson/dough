
const u = require('./core');
const impl = u.prototype;
const Umbrella = impl.constructor;

impl.children = function(selector) {
  const children = this.length == 1 ?
    u(this.nodes[0].childNodes) : this.array(getChildren)
  return selector ? children.filter(selector) : children
}

function getChildren(node) {
  return node.childNodes
}

Object.defineProperty(impl, 'childNodes', {
  get() { return this.nodes[0].childNodes }
});

impl.closest = function(selector, context) {
  const matches = this._matcher(selector)
  return this.map((node, i) => {
    const owner = context || node.ownerDocument
    while (node && node != owner) {
      if (matches(node, i)) return node
      node = node.parentNode
    }
  })
}

impl.contains = function(arg) {
  if (arg) {
    const {nodes} = this
    const matches = typeof arg == 'string'
      ? (node) => node.querySelector(arg) !== null
      : (node) => node.contains(arg) && node !== arg
    for (let i = 0; i < nodes.length; i++) {
      if (matches(nodes[i])) return true
    }
  }
  return false
}

impl.eq = function(index) {
  const node = this.nodes[index < 0 ? this.length + index : index]
  return node ? new Umbrella([node]) : u()
};

impl.find = function(selector) {
  const {nodes} = this
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i].querySelector(selector)
    if (node) return new Umbrella([node])
  }
  return u()
};

impl.findAll = function(selector) {
  if (typeof selector != 'string') {
    const matches = this._matcher(selector)
    return this.map(node =>
      node.querySelectorAll('*').filter(matches))
  }
  return this.map(node =>
    node.querySelectorAll(selector))
};

impl.findLast = function(selector) {
  const {nodes} = this
  for (let i = nodes.length; i > 0; i) {
    const node = last(nodes[--i].querySelectorAll(selector))
    if (node) return new Umbrella([node])
  }
  return u()
};

impl.first = function(selector) {
  const {nodes} = this
  if (arguments.length) {
    const matches = this._matcher(selector)
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      if (matches(node, i)) {
        return new Umbrella([node])
      }
    }
    return u()
  }
  return nodes.length > 1
    ? new Umbrella([nodes[0]])
    : this
};

Object.defineProperty(impl, 'firstChild', {
  get() { return this.nodes[0].firstChild }
});

Object.defineProperty(impl, 'firstNode', {
  get() { return this.nodes[0] }
});

impl.indexOf = function(arg) {
  return this.nodes.indexOf(u(arg).firstNode)
}

const indexOf = Function.call.bind(Array.prototype.indexOf)
Object.defineProperty(impl, 'index', {
  get() {
    const node = this.nodes[0]
    return indexOf(node.parentNode.childNodes, node)
  }
})

impl.last = function(selector) {
  const {nodes} = this
  if (arguments.length) {
    const matches = this._matcher(selector)
    for (let i = nodes.length; i > 0; i) {
      const node = nodes[--i]
      if (matches(node, i)) {
        return new Umbrella([node])
      }
    }
    return u()
  }
  return nodes.length > 1
    ? new Umbrella([nodes[nodes.length - 1]])
    : this
};

Object.defineProperty(impl, 'lastChild', {
  get() { return last(this.nodes).lastChild }
});

Object.defineProperty(impl, 'lastNode', {
  get() { return last(this.nodes) }
});

function last(arr) {
  return arr[arr.length - 1]
}

impl.parent = function(selector) {
  if (this.length == 1) {
    const parent = this.parentNode
    if (!u.isElem(parent)) return u()
    return u(selector && !this._matches(selector, parent) ? null : parent)
  } else {
    const parents = this.map(getParent)
    return selector ? parents.filter(selector) : parents
  }
};

function getParent(node) {
  // Avoid document fragments.
  if (u.isElem(node.parentNode)) {
    return node.parentNode
  }
}

Object.defineProperty(impl, 'parentNode', {
  get() { return this.nodes[0].parentNode }
});

impl.siblings = function(selector) {
  return this.parent().children(selector).not(this)
}
