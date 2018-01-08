
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

impl.eq = function(index) {
  const node = this.nodes[index < 0 ? this.length + index : index]
  return node ? new Umbrella([node]) : u()
};

impl.find = function(selector) {
  if (typeof selector != 'string') {
    const matches = this._matcher(selector)
    return this.map(node =>
      node.querySelectorAll('*').filter(matches))
  }
  return this.map(node =>
    node.querySelectorAll(selector))
};

impl.first = function(selector) {
  const {nodes} = this
  let node
  if (arguments.length) {
    for (let i = 0; i < nodes.length; i++) {
      node = nodes[i].querySelector(selector)
      if (node) return new Umbrella([node])
    }
    return u()
  } else if (nodes.length > 1) {
    node = nodes[0]
    if (node) return new Umbrella([node])
  }
  return this
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
  let node
  if (arguments.length) {
    for (let i = nodes.length; i > 0; i) {
      node = last(nodes[--i].querySelectorAll(selector))
      if (node) return new Umbrella([node])
    }
    return u()
  } else if (nodes.length > 1) {
    node = last(nodes)
    if (node) return new Umbrella([node])
  }
  return this
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
    return u(selector && !this._matches(selector, parent) ? null : parent)
  } else {
    const parents = this.map(getParent)
    return selector ? parents.filter(selector) : parents
  }
};

function getParent(node) {
  return node.parentNode
}

Object.defineProperty(impl, 'parentNode', {
  get() { return this.nodes[0].parentNode }
});

impl.siblings = function(selector) {
  return this.parent().children(selector).not(this)
}
