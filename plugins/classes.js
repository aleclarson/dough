
const u = require('./core');

// Add class(es) to the matched nodes
u.prototype.addClass = function () {
  return this.eacharg(arguments, function (el, name) {
    el.classList.add(name);
  });
};


// Find out whether the matched elements have a class or not
u.prototype.hasClass = function () {
  // Check if any of them has all of the classes
  return this.is('.' + this.args(arguments).join('.'));
};


// Check whether any of the nodes matches the selector
u.prototype.is = function (selector) {
  return this.filter(selector).length > 0;
};


// Delete all of the nodes that equals the filter
u.prototype.not = function (filter) {
  return this.filter(function (node) {
    return !u(node).is(filter || true);
  });
};


// Removes a class from all of the matched nodes
u.prototype.removeClass = function () {
  // Loop the combination of each node with each argument
  return this.eacharg(arguments, function (el, name) {
    // Remove the class using the native method
    el.classList.remove(name);
  });
};


// Activate/deactivate classes in the elements
u.prototype.toggleClass = function (classes, addOrRemove) {
  /* jshint -W018 */
  // Check if addOrRemove was passed as a boolean
  if (!!addOrRemove === addOrRemove) {
    return this[addOrRemove ? 'addClass' : 'removeClass'](classes);
  }
  /* jshint +W018 */

  // Loop through all the nodes and classes combinations
  return this.eacharg(classes, function (el, name) {
    el.classList.toggle(name);
  });
};
