
const u = require('./core');

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


// [INTERNAL USE ONLY]
// Select the adecuate part from the context
u.prototype.select = function (parameter, context) {
  // Allow for spaces before or after
  parameter = parameter.replace(/^\s*/, '').replace(/\s*$/, '');

  if (context) {
    return this.select.byCss(parameter, context);
  }

  for (var key in this.selectors) {
    // Reusing it to save space
    context = key.split('/');
    if ((new RegExp(context[1], context[2])).test(parameter)) {
      return this.selectors[key](parameter);
    }
  }

  return this.select.byCss(parameter);
};

// Select some elements using a css Selector
u.prototype.select.byCss = function (parameter, context) {
  return (context || document).querySelectorAll(parameter);
};

// Allow for adding/removing regexes and parsing functions
// It stores a regex: function pair to process the parameter and context
u.prototype.selectors = {};

// Find some html nodes using an Id
u.prototype.selectors[/^\.[\w\-]+$/] = function (param) {
  return document.getElementsByClassName(param.substring(1));
};

// The tag nodes
u.prototype.selectors[/^\w+$/] = function (param) {
  return document.getElementsByTagName(param);
};

// Find some html nodes using an Id
u.prototype.selectors[/^\#[\w\-]+$/] = function (param) {
  return document.getElementById(param.substring(1));
};

// Create a new element for the DOM
u.prototype.selectors[/^</] = function (param) {
  return u().generate(param);
};


// [INTERNAL USE ONLY]

// Force it to be an array AND also it clones them
// http://toddmotto.com/a-comprehensive-dive-into-nodelists-arrays-converting-nodelists-and-understanding-the-dom/
u.prototype.slice = function (pseudo) {
  // Check that it's not a valid object
  if (!pseudo ||
      pseudo.length === 0 ||
      typeof pseudo === 'string' ||
      pseudo.toString() === '[object Function]') return [];

  // Accept also a u() object (that has .nodes)
  return pseudo.length ? [].slice.call(pseudo.nodes || pseudo) : [pseudo];
};


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
