// TODO: Postpone mounting if `frame.elapsed` is too long.

const frame = require('framesync');
const ruley = require('ruley');

const u = require('./core');
const impl = u.prototype;

// Asynchronous nodes are hidden until the next frame.
const asyncRule = ruley('visibility: hidden !important;')

// Nodes are inserted asynchronously when their parent exists in the DOM.
const asyncRender = AsyncRenderer()

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
  } else {
    const node = this.nodes[0]
    return node ? node.innerHTML : ''
  }
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
  } else {
    const node = this.nodes[0]
    return node ? node.textContent : ''
  }
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
    const mount = function(node) {
      asyncRender.unschedule(node)
      document.contains(this) ?
        asyncRender.schedule(node, this, render) :
        render.call(this, node)
    }
    for (let i = 0, val; i < vals.length; i++) {
      val = vals[i]
      if (val == null) continue
      if (parent) {
        if (val.nodeType) {
          mount.call(parent, val)
        }
        else if (typeof val == 'object') {
          u(val).nodes.forEach(mount, parent)
        }
        else {
          u._parseHTML(val).forEach(mount, parent)
        }
      }
      else if (typeof val == 'object') {
        val = u(val)
        parents.forEach(parent =>
          val.clone().nodes.forEach(mount, parent))
      }
      else {
        val = u._parseHTML(val)
        parents.forEach((parent, i) =>
          (i ? val.map(cloneNode) : val).forEach(mount, parent))
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

// Nodes are inserted asynchronously
// if their parent is already in the DOM.
function AsyncRenderer() {
  const batch = []
  function flush() {
    console.timeStamp('START asyncRender.flush()')
    const nodes = []
    for (let i = 0, next; i < batch.length; i++) {
      next = batch[i]
      next.node._id = null
      asyncRule.apply(next.node)
      next.render.call(next.parent, next.node)
      nodes.push(next.node)
    }
    console.timeStamp('FINISH asyncRender.flush()')
    batch.length = 0
    frame.once('render', () => {
      console.log('asyncRender: ', nodes)
      console.timeStamp('asyncRender.reveal()')
      const event = {bubbles: false}
      for (let i = 0, node; i < nodes.length; i++) {
        node = nodes[i]
        asyncRule.peel(node)
        $(node).trigger('render', event)
      }
    })
  }
  return {
    schedule(node, parent, render) {
      node._id = batch.length
      batch[node._id] = {node, parent, render}
      if (node._id == 0) {
        setTimeout(flush)
      }
    },
    unschedule(node) {
      if (node._id != null) {
        batch[node._id] = null
        node._id = null
      }
    }
  }
}
