
const u = require('./core');

// Get the direct children of all of the nodes with an optional filter
u.prototype.children = function (selector) {
  return this.map(function (node) {
    return this.slice(node.children);
  }).filter(selector);
};


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


// Get the first of the nodes
u.prototype.first = function () {
  return this.nodes[0] || false;
};


  // Get the last of the nodes
u.prototype.last = function () {
  return this.nodes[this.length - 1] || false;
};


// Travel the matched elements one node up
u.prototype.parent = function (selector) {
  return this.map(function (node) {
    return node.parentNode;
  }).filter(selector);
};


// Travel the matched elements at the same level
u.prototype.siblings = function (selector) {
  return this.parent().children(selector).not(this);
};
