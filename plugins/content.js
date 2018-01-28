// TODO: Postpone mounting if `frame.elapsed` is too long.

const frame = require('framesync');

const u = require('./core');
const impl = u.prototype;

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
    parent.insertBefore(node, below)
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
  return this.each(removeChildren)
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
  if (typeof arg != 'function') {
    return this._mount(arguments, wrapNode)
  }
  return this.each((node, i) => {
    const wrapper = u(arg(node, i))
    if (wrapper.length) {
      unschedule(node)
      if (document.contains(node)) {
        frame.once('render', wrapNode.bind(node, wrapper))
      } else {
        wrapNode.call(node, wrapper)
      }
    }
  })
};

//
// Helpers
//

impl._mount = function(vals, render) {
  const parents = this.nodes
  if (parents.length) {
    const parent = parents.length > 1 ? null : parents[0]
    for (let i = 0, val; i < vals.length; i++) {
      val = vals[i]
      if (val == null) continue
      if (parent) {
        if (val.nodeType) {
          render.call(parent, val)
        }
        else if (typeof val == 'object') {
          u(val).nodes.forEach(render, parent)
        }
        else {
          u._parseHTML(val).forEach(render, parent)
        }
      }
      else if (typeof val == 'object') {
        val = u(val)
        parents.forEach(parent =>
          val.clone().nodes.forEach(render, parent))
      }
      else {
        val = u._parseHTML(val)
        parents.forEach((parent, i) =>
          (i ? val.map(cloneNode) : val).forEach(render, parent))
      }
    }
  }
  return this
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
  const parent = node.parentNode
  if (parent) parent.removeChild(node)
}
