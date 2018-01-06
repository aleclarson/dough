
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


Object.defineProperty(u.prototype, 'firstNode', {
  get() { return this.nodes[0] }
});


// Get the last of the nodes
u.prototype.last = function () {
  const node = this.lastNode
  return node ? new Umbrella([node]) : this
};


Object.defineProperty(u.prototype, 'lastNode', {
  get() { return this.nodes[this.nodes.length - 1] }
});


// Travel the matched elements one node up
u.prototype.parent = function (selector) {
  return this.map(function (node) {
    return node.parentNode;
  }).filter(selector);
};


Object.defineProperty(u.prototype, 'parentNode', {
  get() { return this.nodes[0].parentNode }
});


// Travel the matched elements at the same level
u.prototype.siblings = function (selector) {
  return this.parent().children(selector).not(this);
};
