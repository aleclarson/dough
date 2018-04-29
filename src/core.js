
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

function $(val, context) {
  // Null/undefined always returns the same instance.
  if (val == null) {
    return emptyInst
  }
  // Return instances immediately.
  if ($.is(val)) {
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
    nodes = onlyNodes(val)
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

module.exports = $

$.is = function(val) {
  return val && val.constructor == Umbrella
}

$.isElem = function(val) {
  return val && val.nodeType == 1
}

$.isText = function(val) {
  return val && val.nodeType == 3
}

$.elem = function(tag) {
  return document.createElement(tag)
}

$.text = function(text) {
  return document.createTextNode(text)
}

const capsRE = /([A-Z])/g
const kebabify = (ch) => '-' + ch.toLowerCase()
const noKebab = {
  viewBox: 1,
}

$.kebab = function(str) {
  return noKebab[str] ? str : str.replace(capsRE, kebabify)
}

$.addSelector = function(regex, select) {
  selectors.push({
    test: regex.test.bind(regex),
    select,
  })
}

// Expose the prototype and support `instanceof` checks.
$.prototype = Umbrella.prototype

// This made the code faster, read "Initializing instance variables" in
// https://developers.google.com/speed/articles/optimizing-javascript
// Also, freeze the array to prevent mutations.
$.prototype.nodes = Object.freeze([])

Object.defineProperty($.prototype, 'length', {
  get() { return this.nodes.length }
})

// [INTERNAL USE ONLY]
$._initAttributes = initAttributes
$._parseHTML = parseHTML
$._select = select
$._slice = (vals, filter) =>
  vals && isArrayish(vals) ? slice(vals, filter) : []
$._split = (str) => str.trim().split(' ')
$._splitReduce = (arr) => reduce.call(arr, splitReducer, [])

//
// Helpers
//

// Perf comparison: https://jsperf.com/generate-dom-node
function parseHTML(html, attrs) {
  // Detect strings like '<div>'
  if (singleTagRE.test(html)) {
    const node = document.createElement(html.slice(1, -1))
    if (isObject(attrs)) initAttributes(node, attrs)
    return [node]
  }
  // This is at least 2x slower than `setAttrs`
  return slice(htmlRange.createContextualFragment(html).childNodes, notEmpty)
}

// This is only called during node creation.
function initAttributes(node, attrs) {
  for (let attr in attrs) {
    let val = attrs[attr]
    switch (attr) {

      case 'class':
        // SVG className works differently (see https://goo.gl/8bRsGX)
        if (node.tagName == 'SVG') {
          node.setAttribute(attr, val)
        } else {
          node.className = val
        }
        break

      case 'children':
        if (typeof val == 'function') {
          val = val.call(node, attrs)
        }
        $(val).appendTo(node)
        break

      case 'text':
        node.textContent = val
        break

      default:
        node.setAttribute(attr, val)
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

function onlyNodes(vals) {
  if (vals.length) {
    const nodes = []
    eachNode(vals, (node) => nodes.push(node))
    return nodes
  }
  return vals
}

function eachNode(vals, iterator) {
  for (let i = 0, val; i < vals.length; i++) {
    val = vals[i]
    if (Array.isArray(val)) {
      eachNode(val, iterator)
    } else if (validNode(val)) {
      iterator(val)
    } else if ($.is(val)) {
      val.each(iterator)
    }
  }
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
  return res.concat($._split(arg))
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
$.addSelector(/^\.[\w\-]+$/, function(val) {
  return document.getElementsByClassName(val.slice(1))
})

// Find nodes with the given HTML tag.
$.addSelector(/^\w+$/, function(val) {
  return document.getElementsByTagName(val)
})

// Find the first node with the given `id` attribute.
$.addSelector(/^\#[\w\-]+$/, function(val) {
  return document.getElementById(val.slice(1))
})
