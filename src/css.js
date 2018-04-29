
import css from 'stylefire/css'

const $ = require('./core')

const proto = $.prototype

proto.css = function() {
  return this._pairs(arguments, styleFns)
}

proto.render = function() {
  const {nodes} = this
  for (let i = 0; i < nodes.length; i++) {
    const style = nodes[i]._style
    if (style) style.render()
  }
  return this
}

Object.defineProperty(proto, 'style', {
  get() { return this.nodes[0].style }
})

//
// Helpers
//

const styleFns = {
  get(node, prop) {
    // Avoid text nodes.
    if ($.isElem(node)) {
      prop = $.kebab(prop)
      if (document.contains(node)) {
        if (!node._style) node._style = css(node)
        return node._style.get(prop)
      }
      return node.style[prop]
    }
  },
  set(nodes, prop, value) {
    if (typeof value == 'undefined') return
    prop = $.kebab(prop)
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      // Avoid text nodes.
      if ($.isElem(node)) {
        if (node._anims) {
          const anim = node._anims[prop]
          if (anim) anim.stop()
        }

        let style = node._style
        if (!style) node._style = style = css(node)
        style.set(prop, value)

        // Update immediately if not mounted.
        document.contains(node) || style.render()
      }
    }
  }
}
