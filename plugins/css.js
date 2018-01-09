
import css from 'stylefire/css'

const u = require('./core')
const isObject = require('is-object')

const impl = u.prototype

impl.css = function() {
  const {nodes} = this
  let prop = arguments[0]
  if (nodes.length) {
    let value = arguments[1]
    if (typeof prop == 'string') {
      if (arguments.length == 1) {
        return getStyleProp(nodes[0], prop)
      }
      setStyleProp(nodes, prop, value)
    }
    else if (isObject(prop)) {
      const values = prop
      for (prop in values) {
        value = values[prop]
        setStyleProp(nodes, prop, value)
      }
    }
  }
  else if (typeof prop == 'string') {
    if (arguments.length == 1) return
  }
  return this
}

impl.render = function() {
  const {nodes} = this
  for (let i = 0; i < nodes.length; i++) {
    const style = nodes[i]._style
    if (style) style.render()
  }
  return this
}

//
// Helpers
//

function getStyleProp(node, prop) {
  // Avoid text nodes.
  if (u.isElem(node)) {
    prop = u.kebab(prop)
    if (document.contains(node)) {
      if (!node._style) node._style = css(node)
      return node._style.get(prop)
    }
    return node.style[prop]
  }
}

function setStyleProp(nodes, prop, value) {
  if (typeof value == 'undefined') return
  prop = u.kebab(prop)
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    // Avoid text nodes.
    if (u.isElem(node)) {
      if (node._anims) {
        const anim = node._anims[prop]
        if (anim) anim.stop()
      }
      if (!node._style) node._style = css(node)
      node._style.set(prop, value)
    }
  }
}
