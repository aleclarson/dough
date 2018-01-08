// TODO: Postpone mounting if `timeSinceLastFrame` is too long.

const u = require('./core');
const impl = u.prototype;

impl.after = function() {
  const {nodes} = this
  for (let i = 0; i < nodes.length; i++) {
    const after = nodes[i].nextSibling
    eachNode(arguments, insertBefore, after)
  }
  return this
};

impl.append = function() {
  const {nodes} = this
  for (let i = 0; i < nodes.length; i++) {
    const parent = nodes[i]
    eachNode(arguments, appendChild, parent)
  }
  return this
};

impl.appendTo = function(parent, context) {
  if (parent) u(parent, context).append(this)
  return this
};

impl.before = function() {
  const {nodes} = this
  for (let i = 0; i < nodes.length; i++) {
    const after = nodes[i]
    eachNode(arguments, insertBefore, after)
  }
  return this
};

impl.empty = function() {
  const {nodes} = this
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    while (node.firstChild) {
      node.removeChild(node.firstChild)
    }
  }
  return this
};

impl.html = function(text) {
  if (arguments.length) {
    const {nodes} = this
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].innerHTML = text
    }
    return this
  }
  return this.nodes[0].innerHTML
};

impl.prepend = function() {
  const {nodes} = this
  for (let i = 0; i < nodes.length; i++) {
    const after = nodes[i].firstChild
    eachNode(arguments, insertBefore, after)
  }
  return this
};

impl.prependTo = function(parent, context) {
  if (parent) u(parent, context).prepend(this)
  return this
};

impl.remove = function() {
  return this.each(removeNode)
};

impl.text = function(text) {
  if (arguments.length) {
    const {nodes} = this
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].textContent = text
    }
    return this
  }
  return this.nodes[0].textContent
};

impl.wrap = function(arg) {
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
  const sibling = this
  if (this._mounting) {
    node._mounting = requestAnimationFrame(mount)
  } else {
    if (!u.isElem(this.parentNode)) {
      throw Error('Cannot insert before a detached node')
    }
    if (document.contains(this.parentNode)) {
      node._mounting = requestAnimationFrame(mount)
    } else {
      mount()
    }
  }
  function mount() {
    removeNode(node)
    sibling.parentNode.insertBefore(node, sibling)
  }
}

function appendChild(node) {
  const parent = this
  if (document.contains(parent)) {
    node._mounting = requestAnimationFrame(mount)
  } else {
    mount()
  }
  function mount() {
    removeNode(node)
    parent.appendChild(node)
  }
}

function wrapNode(wrapper) {
  const parent = this.parentNode
  if (parent) parent.replaceChild(wrapper, this)
  wrapper.appendChild(this)
}

function removeNode(node) {
  if (node._mounting) {
    cancelAnimationFrame(node._mounting)
    node._mounting = undefined
  }
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
