// TODO: Postpone mounting if `timeSinceLastFrame` is too long.

const u = require('./core');
const impl = u.prototype;

const nextFrame = requestAnimationFrame;

impl.after = function() {
  let above, below
  return this._mount(arguments, function(node) {
    const parent = this.parentNode
    if (!parent) {
      throw Error('Cannot insert after a detached node')
    }
    if (above != this) {
      above = this
      below = this.nextSibling
    }
    parent.insertBefore(node, siblingAfter)
  })
};

impl.append = function() {
  return this._mount(arguments, appendChild)
};

impl.appendTo = function(parent, context) {
  if (parent) u(parent, context).append(this)
  return this
};

impl.before = function() {
  return this._mount(arguments, insertBefore)
};

impl.empty = function() {
  return this.each(node => {
    if (node._mounting || document.contains(node)) {
      nextFrame(removeChildren.bind(null, node))
    } else {
      removeChildren(node)
    }
  })
};

// TODO: Mutations should be async.
impl.html = function(text) {
  if (arguments.length) {
    return this.each(node => {
      node.innerHTML = text
    })
  }
  return this.nodes[0].innerHTML
};

impl.prepend = function() {
  let parent, below
  return this._mount(arguments, function(node) {
    if (parent != this) {
      parent = this
      below = this.firstChild
    }
    this.insertBefore(node, below)
  })
};

impl.prependTo = function(parent, context) {
  if (parent) u(parent, context).prepend(this)
  return this
};

impl.remove = function() {
  return this.each(removeNode)
};

impl.replace = function() {
  return this._mount(arguments, replaceNode)
};

// TODO: Mutations should be async.
impl.text = function(text) {
  if (arguments.length) {
    return this.each(node => {
      node.textContent = text
    })
  }
  return this.nodes[0].textContent
};

impl.wrap = function(arg) {
  if (typeof arg == 'function') {
    return this.each((node, i) => {
      const wrapper = u(arg(node, i))
      if (wrapper.length) {
        unschedule(node)
        if (document.contains(node)) {
          nextFrame(wrapNode.bind(node, wrapper))
        } else {
          wrapNode.call(node, wrapper)
        }
      }
    })
  }
  return this._mount(arguments, wrapNode)
};

// Mount each value in the given array to each node in the current set.
impl._mount = function(vals, mount) {
  const {nodes} = this
  if (nodes.length) {
    const render = function(node) {
      unschedule(node)
      if (this._mounting || document.contains(this)) {
        node._mounting = nextFrame(mount.bind(this, node))
      } else {
        mount.call(this, node)
      }
    }
    if (nodes.length == 1) {
      addToParent(nodes[0], vals, render)
    } else {
      addToParents(nodes, vals, render)
    }
  }
  return this
}

//
// Helpers
//

// Avoid cloning for single parent.
function addToParent(parent, vals, render) {
  for (let i = 0, val; i < vals.length; i++) {
    val = vals[i]
    if (val == null) continue
    if (val.nodeType) {
      render.call(parent, val)
    } else if (typeof val == 'object') {
      u(val).nodes.forEach(render, parent)
    } else {
      u._parseHTML(val).forEach(render, parent)
    }
  }
}

// Clone or generate a node for each parent.
function addToParents(parents, vals, render) {
  for (let i = 0, val; i < vals.length; i++) {
    val = vals[i]
    if (val == null) continue
    if (typeof val == 'object') {
      val = u(val)
      parents.forEach(parent =>
        val.clone().nodes.forEach(render, parent))
    } else {
      val = u._parseHTML(val)
      parents.forEach((parent, i) =>
        (i > 0 ? val.map(cloneNode) : val).forEach(render, parent))
    }
  }
}

function cloneNode(node) {
  return node.cloneNode(true)
}

function appendChild(node) {
  this.appendChild(node)
}

function insertBefore(node) {
  const parent = this.parentNode
  if (parent) {
    parent.insertBefore(node, this)
  } else {
    throw Error('Cannot insert before a detached node')
  }
}

function replaceNode(replacer) {
  const parent = this.parentNode
  if (parent) {
    parent.replaceChild(replacer, this)
  } else {
    throw Error('Cannot replace a detached node')
  }
}

function wrapNode(wrapper) {
  const parent = this.parentNode
  if (parent) parent.replaceChild(wrapper, this)
  wrapper.appendChild(this)
}

function removeChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}

function removeNode(node) {
  if (!node._unmounting) {
    const parent = node.parentNode
    if (parent) {
      if (node._mounting || document.contains(node)) {
        node._unmounting = nextFrame(() => parent.removeChild(node))
      } else {
        parent.removeChild(node)
      }
    }
  }
}

function unschedule(node) {
  if (node._mounting) {
    cancelAnimationFrame(node._mounting)
    node._mounting = undefined
  } else if (node._unmounting) {
    cancelAnimationFrame(node._unmounting)
    node._unmounting = undefined
  }
}
