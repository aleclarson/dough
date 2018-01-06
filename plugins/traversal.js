
const u = require('./core');
const Umbrella = u.prototype.constructor;


u.prototype.children = function(selector) {
  const children = this.length == 1 ?
    u(this.nodes[0].childNodes) : this.array(getChildren)
  return selector ? children.filter(selector) : children
}

function getChildren(node) {
  return node.childNodes
}


Object.defineProperty(u.prototype, 'childNodes', {
  get() { return this.nodes[0].childNodes }
});


u.prototype.closest = function(selector) {
  const matches = this._matcher(selector)
  return this.map((node, i) => {
    while (node && node != document) {
      if (matches(node, i)) return node
      node = node.parentNode
    }
  })
}


u.prototype.eq = function(index) {
  const node = this.nodes[index < 0 ? this.length + index : index]
  return node ? new Umbrella([node]) : u()
};


// Find all the nodes children of the current ones matched by a selector
u.prototype.find = function (selector) {
  return this.map(function (node) {
    return u(selector || '*', node);
  });
};


u.prototype.first = function () {
  const node = this.nodes[0]
  return node ? new Umbrella([node]) : this
};


Object.defineProperty(u.prototype, 'firstChild', {
  get() { return this.nodes[0].firstChild }
});


Object.defineProperty(u.prototype, 'firstNode', {
  get() { return this.nodes[0] }
});


const indexOf = Function.call.bind(Array.prototype.indexOf)
u.prototype.index = function(arg) {
  if (arguments.length == 0) {
    const node = this.nodes[0]
    return indexOf(node.parentNode.children, node)
  } else {
    return indexOf(this.nodes, u(arg).firstNode)
  }
}


// Get the last of the nodes
u.prototype.last = function () {
  const node = this.lastNode
  return node ? new Umbrella([node]) : this
};


Object.defineProperty(u.prototype, 'lastChild', {
  get() { return this.nodes[0].lastChild }
});


Object.defineProperty(u.prototype, 'lastNode', {
  get() { return this.nodes[this.nodes.length - 1] }
});


u.prototype.parent = function(selector) {
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


Object.defineProperty(u.prototype, 'parentNode', {
  get() { return this.nodes[0].parentNode }
});


// Travel the matched elements at the same level
u.prototype.siblings = function (selector) {
  return this.parent().children(selector).not(this);
};
