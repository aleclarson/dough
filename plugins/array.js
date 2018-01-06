
const u = require('./core');

u.prototype.array = function(iterator) {
  if (typeof iterator != 'function') {
    return this.nodes.slice()
  }
  return this.nodes.reduce((arr, node, i) => {
    const res = iterator.call(this, node, i)
    return res ? arr.concat(u(res).nodes) : arr
  }, [])
}


// Loops through every node from the current call
u.prototype.each = function (callback) {
  // By doing callback.call we allow "this" to be the context for
  // the callback (see http://stackoverflow.com/q/4065353 precisely)
  this.nodes.forEach(callback.bind(this));

  return this;
};


// .filter(selector)
// Delete all of the nodes that don't pass the selector
u.prototype.filter = function (selector) {
  // The default function if it's a css selector
  // Cannot change name to 'selector' since it'd mess with it inside this fn
  var callback = function (node) {
    // Make it compatible with some other browsers
    node.matches = node.matches || node.msMatchesSelector || node.webkitMatchesSelector;

    // Check if it's the same element (or any element if no selector was passed)
    return node.matches(selector || '*');
  };

  // filter() receives a function as in .filter(e => u(e).children().length)
  if (typeof selector === 'function') callback = selector;

  // filter() receives an instance of Umbrella as in .filter(u('a'))
  if (selector instanceof u) {
    callback = function (node) {
      return (selector.nodes).indexOf(node) !== -1;
    };
  }

  // Just a native filtering function for ultra-speed
  return u(this.nodes.filter(callback));
};


// Merge all of the nodes that the callback returns
u.prototype.map = function (callback) {
  return callback ? u(this.array(callback)).unique() : this;
};
