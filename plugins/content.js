
const u = require('./core');

u.prototype.after = function() {
  const {nodes} = this
  for (let i = 0; i < nodes.length; i++) {
    const after = nodes[i].nextSibling
    eachNode(arguments, insertBefore, after)
  }
  return this
};

u.prototype.append = function() {
  const {nodes} = this
  for (let i = 0; i < nodes.length; i++) {
    const parent = nodes[i]
    eachNode(arguments, appendChild, parent)
  }
  return this
};

u.prototype.before = function() {
  const {nodes} = this
  for (let i = 0; i < nodes.length; i++) {
    const after = nodes[i]
    eachNode(arguments, insertBefore, after)
  }
  return this
};

u.prototype.empty = function() {
  const {nodes} = this
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    while (node.firstChild) {
      node.removeChild(node.firstChild)
    }
  }
  return this
};

u.prototype.html = function(text) {
  if (arguments.length) {
    const {nodes} = this
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].innerHTML = text
    }
    return this
  }
  return this.nodes[0].innerHTML
};

u.prototype.prepend = function() {
  const {nodes} = this
  for (let i = 0; i < nodes.length; i++) {
    const after = nodes[i].firstChild
    eachNode(arguments, insertBefore, after)
  }
  return this
};

u.prototype.remove = function() {
  return this.each(removeNode)
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

u.prototype.text = function(text) {
  if (arguments.length) {
    const {nodes} = this
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].textContent = text
    }
    return this
  }
  return this.nodes[0].textContent
};

u.prototype.wrap = function(arg) {
  const {nodes} = this
  if (arg && nodes.length) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      if (typeof arg == 'function') {
        withNode(arg.call(node), wrapNode, node)
      } else {
        withNode(arg, wrapNode, node)
      }
    }
  }
  return this
};

//
// Helpers
//

function insertBefore(node) {
  removeNode(node)
  this.parentNode.insertBefore(node, this)
}

function appendChild(node) {
  removeNode(node)
  this.appendChild(node)
}

function wrapNode(wrapper) {
  const parent = this.parentNode
  if (parent) parent.replaceChild(wrapper, this)
  wrapper.appendChild(this)
}

function removeNode(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node)
  }
}

function eachNode(args, fn, ctx) {
  for (let i = 0; i < args.length; i++) {
    withNode(args[i], fn, ctx)
  }
}

function withNode(arg, fn, ctx) {
  if (arg != null) {
    if (u.is(arg)) {
      arg.nodes.forEach(fn, ctx)
    } else if (arg.nodeType) {
      fn.call(ctx, arg)
    } else {
      u._fragment(arg).childNodes.forEach(fn, ctx)
    }
  }
}
