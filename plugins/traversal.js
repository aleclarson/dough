
const u = require('./core');
const Umbrella = u.prototype.constructor;

// Get the direct children of all of the nodes with an optional filter
u.prototype.children = function (selector) {
  return this.map(function (node) {
    return this.slice(node.children);
  }).filter(selector);
};


Object.defineProperty(u.prototype, 'childNodes', {
  get() { return this.nodes[0].childNodes }
});


// Find the first ancestor that matches the selector for each node
u.prototype.closest = function (selector) {
  return this.map(function (node) {
    // Keep going up and up on the tree. First element is also checked
    do {
      if (u(node).is(selector)) {
        return node;
      }
    } while ((node = node.parentNode) && node !== document);
  });
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
