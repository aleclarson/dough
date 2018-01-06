
const u = require('./core');

// Add some html as a sibling after each of the matched elements.
u.prototype.after = function (html, data) {
  return this.adjacent(html, data, function (node, fragment) {
    node.parentNode.insertBefore(fragment, node.nextSibling);
  });
};


// Add some html as a child at the end of each of the matched elements.
u.prototype.append = function (html, data) {
  return this.adjacent(html, data, function (node, fragment) {
    node.appendChild(fragment);
  });
};


// Add some html before each of the matched elements.
u.prototype.before = function (html, data) {
  return this.adjacent(html, data, function (node, fragment) {
    node.parentNode.insertBefore(fragment, node);
  });
};


/**
 * Deep clone a DOM node and its descendants.
 * @return {[Object]}         Returns an Umbrella.js instance.
 */
u.prototype.clone = function () {
  return this.map(function (node, i) {
    var clone = node.cloneNode(true);
    var dest = this.getAll(clone);

    this.getAll(node).each(function (src, i) {
      for (var key in this.mirror) {
        this.mirror[key](src, dest.nodes[i]);
      }
    });

    return clone;
  });
};

/**
 * Return an array of DOM nodes of a source node and its children.
 * @param  {[Object]} context DOM node.
 * @param  {[String]} tag     DOM node tagName.
 * @return {[Array]}          Array containing queried DOM nodes.
 */
u.prototype.getAll = function getAll (context) {
  return u([context].concat(u('*', context).nodes));
};

// Store all of the operations to perform when cloning elements
u.prototype.mirror = {};

/**
 * Copy all JavaScript events of source node to destination node.
 * @param  {[Object]} source      DOM node
 * @param  {[Object]} destination DOM node
 * @return {[undefined]]}
 */
u.prototype.mirror.events = function (src, dest) {
  if (!src._e) return;

  for (var type in src._e) {
    src._e[type].forEach(function (event) {
      u(dest).on(type, event);
    });
  }
};

/**
 * Copy select input value to its clone.
 * @param  {[Object]} src  DOM node
 * @param  {[Object]} dest DOM node
 * @return {[undefined]}
 */
u.prototype.mirror.select = function (src, dest) {
  if (u(src).is('select')) {
    dest.value = src.value;
  }
};

/**
 * Copy textarea input value to its clone
 * @param  {[Object]} src  DOM node
 * @param  {[Object]} dest DOM node
 * @return {[undefined]}
 */
u.prototype.mirror.textarea = function (src, dest) {
  if (u(src).is('textarea')) {
    dest.value = src.value;
  }
};


// Remove all children of the matched nodes from the DOM.
u.prototype.empty = function () {
  return this.each(function (node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  });
};


// Set or retrieve the html from the matched node(s)
u.prototype.html = function (text) {
  // Needs to check undefined as it might be ""
  if (text === undefined) {
    return this.first().innerHTML || '';
  }

  // If we're attempting to set some text
  // Loop through all the nodes
  return this.each(function (node) {
    // Set the inner html to the node
    node.innerHTML = text;
  });
};


// Add nodes at the beginning of each node
u.prototype.prepend = function (html, data) {
  return this.adjacent(html, data, function (node, fragment) {
    node.insertBefore(fragment, node.firstChild);
  });
};


// Delete the matched nodes from the DOM
u.prototype.remove = function () {
  // Loop through all the nodes
  return this.each(function (node) {
    // Perform the removal only if the node has a parent
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  });
};


// Replace the matched elements with the passed argument.
u.prototype.replace = function (html, data) {
  var nodes = [];
  this.adjacent(html, data, function (node, fragment) {
    nodes = nodes.concat(this.slice(fragment.children));
    node.parentNode.replaceChild(fragment, node);
  });
  return u(nodes);
};


// Set or retrieve the text content from the matched node(s)
u.prototype.text = function (text) {
  // Needs to check undefined as it might be ""
  if (text === undefined) {
    return this.first().textContent || '';
  }

  // If we're attempting to set some text
  // Loop through all the nodes
  return this.each(function (node) {
    // Set the text content to the node
    node.textContent = text;
  });
};


u.prototype.wrap = function (selector) {
  function findDeepestNode (node) {
    while (node.firstElementChild) {
      node = node.firstElementChild;
    }

    return u(node);
  }
  // 1) Construct dom node e.g. u('<a>'),
  // 2) clone the currently matched node
  // 3) append cloned dom node to constructed node based on selector
  return this.map(function (node) {
    return u(selector).each(function (n) {
      findDeepestNode(n)
        .append(node.cloneNode(true));

      node
        .parentNode
        .replaceChild(n, node);
    });
  });
};
