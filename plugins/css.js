
import css from 'stylefire/css'

const u = require('./core')

const impl = u.prototype

impl.css = function() {
  return this._pairs(arguments, styleFns)
}

impl.render = function() {
  const {nodes} = this
  for (let i = 0; i < nodes.length; i++) {
    const style = nodes[i]._style
    if (style) style.render()
  }
  return this
}

Object.defineProperty(impl, 'style', {
  get() { return this.nodes[0].style }
})

//
// Helpers
//

const styleFns = {
  get(node, prop) {
    // Avoid text nodes.
    if (u.isElem(node)) {
      prop = u.kebab(prop)
      if (document.contains(node)) {
        if (!node._style) node._style = css(node)
        return node._style.get(prop)
      }
      return node.style[prop]
    }
  },
  set(nodes, prop, value) {
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
        if (document.contains(node)) {
          node._style.set(prop, value)
        } else {
          // Skip framesync, but update the cache.
          node._style.get()[prop] = value
          node.style[prop] = value
        }
      }
    }
  }
}
