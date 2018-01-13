
const isObject = require('is-object')
const noop = require('noop')

const emptyInst = Object.create(Umbrella.prototype)
const {reduce} = Array.prototype

const htmlRE = /^\s*\</
const singleTagRE = /^\<[a-z][^\s\>]*\>$/

// Reusable document range for complex HTML parsing
const htmlRange = document.createRange()

function Umbrella(nodes) {
  this.nodes = Object.freeze(nodes)
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
      nodes = parseHTML(val, context)
    } else {
      nodes = select(val, context)
      if (!nodes) return emptyInst
      if (validNode(nodes)) {
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
    nodes = val.filter(validNode)
    if (nodes.length == 0) {
      return emptyInst
    }
  }
  else if (isArrayish(val)) {
    if (val.length) {
      nodes = slice(val, validNode)
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

const capsRE = /([A-Z])/g
const kebabify = (ch) => '-' + ch.toLowerCase()

u.kebab = function(str) {
  return str.replace(capsRE, kebabify)
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
// Also, freeze the array to prevent mutations.
u.prototype.nodes = Object.freeze([])

Object.defineProperty(u.prototype, 'length', {
  get() { return this.nodes.length }
})

// [INTERNAL USE ONLY]
u._parseHTML = parseHTML
u._select = select
u._slice = (vals, filter) =>
  vals && isArrayish(vals) ? slice(vals, filter) : []
u._split = (str) => str.trim().split(' ')
u._splitReduce = (arr) => reduce.call(arr, splitReducer, [])

//
// Helpers
//

// Perf comparison: https://jsperf.com/generate-dom-node
function parseHTML(html, config) {
  // Detect strings like '<div>'
  if (singleTagRE.test(html)) {
    const node = document.createElement(html.slice(1, -1))
    if (isObject(config)) buildElement(node, config)
    return [node]
  }
  // This is at least 2x slower than `buildElement`
  return slice(htmlRange.createContextualFragment(html).childNodes, notEmpty)
}

function buildElement(node, config) {
  for (let key in config) {
    let val = config[key]
    switch (key) {

      case 'class':
        // SVG className works differently (see https://goo.gl/8bRsGX)
        if (node.tagName == 'SVG') {
          node.setAttribute(key, val)
        } else {
          node.className = val
        }
        break

      case 'children':
        if (typeof val == 'function') {
          val = val(config)
        }
        u(val).appendTo(node)
        break

      case 'text':
        node.textContent = val
        break

      default:
        node.setAttribute(key, val)
        break
    }
  }
}

function notEmpty(node) {
  return node.nodeType != 3 ||
    node.textContent.trim().length != 0
}

function validNode(val) {
  return val && !!val.nodeType && notEmpty(val)
}

function isArrayish(val) {
  if (typeof val == 'object') {
    return typeof val.length == 'number'
  }
  return false
}

// Convert an array-like object into a new array. https://goo.gl/Rc1Q2i
function slice(vals, filter = noop.true) {
  const arr = []
  for (let i = 0; i < vals.length; i++) {
    const val = vals[i]
    if (filter(val)) arr.push(val)
  }
  return arr
}

function splitReducer(res, arg) {
  return res.concat(u._split(arg))
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
