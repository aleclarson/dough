
const u = require('./core');
const noop = require('noop');

// Non-standard names are still required. 😳
const nodeMatches = Function.call.bind(
  Element.prototype.matches ||
  Element.prototype.msMatchesSelector ||
  Element.prototype.webkitMatchesSelector
);

// [INTERNAL USE ONLY]
// Add text in the specified position. It is used by other functions
u.prototype.adjacent = function (html, data, callback) {
  if (typeof data === 'number') {
    if (data === 0) {
      data = [];
    } else {
      data = new Array(data).join().split(',').map(Number.call, Number);
    }
  }

  // Loop through all the nodes. It cannot reuse the eacharg() since the data
  // we want to do it once even if there's no "data" and we accept a selector
  return this.each(function (node, j) {
    var fragment = document.createDocumentFragment();

    // Allow for data to be falsy and still loop once
    u(data || {}).map(function (el, i) {
      // Allow for callbacks that accept some data
      var part = (typeof html === 'function') ? html.call(this, el, i, node, j) : html;

      if (typeof part === 'string') {
        return this.generate(part);
      }

      return u(part);
    }).each(function (n) {
      this.isInPage(n)
        ? fragment.appendChild(u(n).clone().first())
        : fragment.appendChild(n);
    });

    callback.call(this, node, fragment);
  });
};


// [INTERNAL USE ONLY]
u.prototype.args = function(args) {
  if (Array.isArray(args)) {
    return args
  }
  if (typeof args == 'string') {
    return splitString(args)
  }
  return this._slice(args).map(splitString)
}

// Split by whitespace
function splitString(str) {
  return str.trim().split(/ +/)
}

// [INTERNAL USE ONLY]
u.prototype.eacharg = function(args, iterator) {
  const {nodes} = this
  if (nodes.length) {
    this.args(args).forEach(arg => {
      for (let i = 0; i < nodes.length; i++) {
        iterator.call(this, nodes[i], arg)
      }
    })
  }
  return this
}


// [INTERNAL USE ONLY]
// Generate a fragment of HTML. This irons out the inconsistences
u.prototype.generate = function (html) {
  // Table elements need to be child of <table> for some f***ed up reason
  if (/^\s*<t(h|r|d)/.test(html)) {
    return u(document.createElement('table')).html(html).children().nodes;
  } else if (/^\s*</.test(html)) {
    return u(document.createElement('div')).html(html).children().nodes;
  } else {
    return document.createTextNode(html);
  }
};


/**
 * Internal use only. This function checks to see if an element is in the page's body. As contains is inclusive and determining if the body contains itself isn't the intention of isInPage this case explicitly returns false.
https://developer.mozilla.org/en-US/docs/Web/API/Node/contains
 * @param  {[Object]}  node DOM node
 * @return {Boolean}        The Node.contains() method returns a Boolean value indicating whether a node is a descendant of a given node or not.
 */
u.prototype.isInPage = function isInPage (node) {
  return (node === document.body) ? false : document.body.contains(node);
};

u.prototype._matcher = function(selector) {
  if (typeof selector == 'string') {
    return (node) => node.nodeType == 1 && nodeMatches(node, selector)
  }
  if (typeof selector == 'function') {
    return selector
  }
  if (u.is(selector)) {
    const {nodes} = selector
    return (node) => nodes.indexOf(node) != -1
  }
  return noop.false
}

u.prototype._matches = function(selector, node) {
  if (typeof selector == 'string') {
    return node.nodeType == 1 && nodeMatches(node, selector)
  }
  if (typeof selector == 'function') {
    return selector(node, 0)
  }
  if (u.is(selector)) {
    return selector.nodes.indexOf(node) > -1
  }
  return false
}

// [INTERNAL USE ONLY]

// Create a string from different things
u.prototype.str = function (node, i) {
  return function (arg) {
    // Call the function with the corresponding nodes
    if (typeof arg === 'function') {
      return arg.call(this, node, i);
    }

    // From an array or other 'weird' things
    return arg.toString();
  };
};
