
const htmlRE = /^\s*</
const emptyInst = Object.create(Umbrella.prototype)

function Umbrella(nodes) {
  this.nodes = nodes
}

function u(val, context) {
  // Null/undefined always returns the same instance.
  if (val == null) {
    return emptyInst
  }
  // Return instances immediately.
  if (u.is(val)) {
    return val
  }
  let nodes
  if (typeof val == 'string') {
    if (htmlRE.test(val)) {
      nodes = slice(fragment(val).childNodes)
    } else {
      nodes = select(val, context)
      if (!nodes) return emptyInst
      if (isNode(nodes)) {
        nodes = [nodes]
      } else if (nodes.length) {
        nodes = slice(nodes)
      } else {
        return emptyInst
      }
    }
  }
  else if (val.nodeType) {
    nodes = [val]
  }
  else if (Array.isArray(val)) {
    nodes = val.filter(isNode)
    if (nodes.length == 0) {
      return emptyInst
    }
  }
  else if (isArrayish(val)) {
    if (val.length) {
      nodes = slice(val)
    } else {
      return emptyInst
    }
  }
  else {
    nodes = [
      // Default to a text node.
      document.createTextNode(val)
    ]
  }
  return new Umbrella(nodes)
}

module.exports = u

u.is = function(val) {
  return val && val.constructor == Umbrella
}

u.isElem = function(val) {
  return val && val.nodeType == 1
}

u.isText = function(val) {
  return val && val.nodeType == 3
}

u.text = function() {
  const nodes = new Array(arguments.length)
  for (let i = 0; i < arguments.length; i++) {
    const val = arguments[i]
    nodes.push(document.createTextNode(val))
  }
  return new Umbrella(nodes)
}

u.addSelector = function(regex, select) {
  selectors.push({
    test: regex.test.bind(regex),
    select,
  })
}

// Expose the prototype and support `instanceof` checks.
u.prototype = Umbrella.prototype

// This made the code faster, read "Initializing instance variables" in
// https://developers.google.com/speed/articles/optimizing-javascript
u.prototype.nodes = []

Object.defineProperty(u.prototype, 'length', {
  get() { return this.nodes.length }
})

// [INTERNAL USE ONLY]
u._fragment = fragment
u.prototype.select = select
u.prototype.slice = (vals) =>
  vals && isArrayish(vals) ? slice(vals) : []

//
// Helpers
//

function fragment(html) {
  const range = document.createRange()
  range.setStart(document.body, 0)
  return range.createContextualFragment(html || '')
}

function isNode(val) {
  return !!val.nodeType
}

function isArrayish(val) {
  if (typeof val == 'object') {
    return typeof val.length == 'number'
  }
  return false
}

// Convert an array-like object into a new array. https://goo.gl/Rc1Q2i
function slice(vals) {
  const len = vals.length
  if (len) {
    const arr = new Array(len)
    for (let val, i = 0; i < len; i++) {
      isNode(val = vals[i]) && (arr[i] = val)
    }
    return arr
  }
  return []
}

function select(selector, context) {
  if (context) {
    return context.querySelectorAll(selector)
  }
  for (let i = 0; i < selectors.length; i++) {
    const {test, select} = selectors[i]
    if (test(selector)) return select(selector)
  }
  return document.querySelectorAll(selector)
}

//
// Built-in selectors
//

const selectors = []

// Find nodes with the given class name.
u.addSelector(/^\.[\w\-]+$/, function(val) {
  return document.getElementsByClassName(val.slice(1))
})

// Find nodes with the given HTML tag.
u.addSelector(/^\w+$/, function(val) {
  return document.getElementsByTagName(val)
})

// Find the first node with the given `id` attribute.
u.addSelector(/^\#[\w\-]+$/, function(val) {
  return document.getElementById(val.slice(1))
})
