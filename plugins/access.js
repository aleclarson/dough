
const u = require('./plugins/core');

// [INTERNAL USE ONLY]

// Handle attributes for the matched elements
u.prototype.attr = function (name, value, data) {
  data = data ? 'data-' : '';

  // This will handle those elements that can accept a pair with these footprints:
  // .attr('a'), .attr('a', 'b'), .attr({ a: 'b' })
  return this.pairs(name, value, function (node, name) {
    return node.getAttribute(data + name);
  }, function (node, name, value) {
    node.setAttribute(data + name, value);
  });
};


// Handle data-* attributes for the matched elements
u.prototype.data = function (name, value) {
  return this.attr(name, value, true);
};


// [INTERNAL USE ONLY]

// Take the arguments and a couple of callback to handle the getter/setter pairs
// such as: .css('a'), .css('a', 'b'), .css({ a: 'b' })
u.prototype.pairs = function (name, value, get, set) {
  // Convert it into a plain object if it is not
  if (typeof value !== 'undefined') {
    var nm = name;
    name = {};
    name[nm] = value;
  }

  if (typeof name === 'object') {
    // Set the value of each one, for each of the { prop: value } pairs
    return this.each(function (node) {
      for (var key in name) {
        set(node, key, name[key]);
      }
    });
  }

  // Return the style of the first one
  return this.length ? get(this.first(), name) : '';
};


// Find the size of the first matched element
u.prototype.size = function () {
  return this.first().getBoundingClientRect();
};
