// TODO: add `pause` and `resume` methods

const $ = require('./core')

import chain from 'popmotion/compositors/chain'
import delay from 'popmotion/compositors/delay'
import tween from 'popmotion/animations/tween'
import css from 'stylefire/css'

const isObject = require('is-object')
const easing = require('popmotion/easing')
const noop = require('noop')

const emptyObject = {}

$.prototype.tween = function(arg) {
  const {nodes} = this
  if (typeof arg == 'string') {
    if (nodes.length == 0) {
      return null
    }
    const anims = nodes[0]._anims
    return anims ? anims[arg] || null : null
  }
  if (!isObject(arg)) {
    throw TypeError('Expected an object or string')
  }
  return _animate(nodes, arg)
}

$.prototype.stop = function(prop) {
  const {nodes} = this
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (node._anims) {
      const anim = node._anims[prop]
      if (anim) anim.stop()
    }
  }
  return this
}

//
// Helpers
//

function _configure(config) {
  let {ease} = config
  if (typeof ease == 'string') {
    config.ease = easing[ease]
  }
  else if (Array.isArray(ease)) {
    if (ease.length != 4) {
      throw Error('Cubic bezier must contain 4 points')
    }
    config.ease = easing.cubicBezier.apply(null, ease)
  }
  if (!config.from) {
    config.from = emptyObject
  }
  return config
}

function _animate(nodes, arg) {
  let stop = noop
  const promise = new Promise((resolve, reject) => {
    if (nodes.length == 0) {
      return resolve()
    }
    let count = 0
    const anims = []
    const config = _configure(arg)
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      if (!node._anims) node._anims = {}
      if (!node._style) node._style = css(node)

      // Create one tween for every property.
      for (let prop in config.to) {
        anims.push(animate(node, prop))
        count += 1
      }
      if (count == 0) {
        return resolve()
      }
    }
    if (count == 1) {
      stop = anims[0].stop
    } else {
      stop = function() {
        anims.forEach(anim => anim._stop())
        const err = new Error('All animations were stopped')
        err.anims = anims
        reject(err)
      }
    }
    function animate(node, key) {
      const prop = $.kebab(key)
      const style = node._style

      let anim = node._anims[prop]
      if (anim) anim.stop()

      let fromValue = config.from[key]
      if (fromValue == null)
        fromValue = style.get(prop)

      anim = tween({
        to: config.to[key],
        from: fromValue,
        ease: config.ease,
        duration: config.duration,
      })

      if (config.delay > 0) {
        anim = chain(delay(config.delay), anim)
      }

      node._anims[prop] = anim = anim.start({
        update: (val) => style.set(prop, val),
        complete() {
          delete node._anims[prop]
          if (--count == 0) resolve()
        }
      })

      anim.node = node
      anim.prop = prop

      anim._stop = anim.stop
      anim.stop = function() {
        delete node._anims[prop]
        this._stop()
        if (config.all) {
          const err = new Error('An animation was stopped')
          err.anim = this
          reject(err)
        }
        else if (--count == 0) {
          resolve()
        }
      }

      return anim
    }
  })

  return {
    stop,
    then: promise.then.bind(promise),
  }
}
