
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


impl.closest = function(selector) {
  const matches = this._matcher(selector)
  return this.map((node, i) => {
    while (node && node != document) {
      if (matches(node, i)) return node
      node = node.parentNode
    }
  })
}


impl.eq = function(index) {
  const node = this.nodes[index < 0 ? this.length + index : index]
  return node ? new Umbrella([node]) : u()
};


// Find all the nodes children of the current ones matched by a selector
impl.find = function (selector) {
  return this.map(function (node) {
    return u(selector || '*', node);
  });
};


impl.first = function () {
  const node = this.nodes[0]
  return node ? new Umbrella([node]) : this
};


Object.defineProperty(impl, 'firstChild', {
  get() { return this.nodes[0].firstChild }
});


Object.defineProperty(impl, 'firstNode', {
  get() { return this.nodes[0] }
});


const indexOf = Function.call.bind(Array.prototype.indexOf)
impl.index = function(arg) {
  if (arguments.length == 0) {
    const node = this.nodes[0]
    return indexOf(node.parentNode.children, node)
  } else {
    return indexOf(this.nodes, u(arg).firstNode)
  }
}


impl.last = function() {
  const node = this.lastNode
  return node ? new Umbrella([node]) : this
};


Object.defineProperty(impl, 'lastChild', {
  get() { return this.nodes[0].lastChild }
});


Object.defineProperty(impl, 'lastNode', {
  get() { return this.nodes[this.nodes.length - 1] }
});


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
