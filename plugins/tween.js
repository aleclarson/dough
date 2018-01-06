
const u = require('./core')

const {onFrameStart} = require('framesync')
const isObject = require('is-object')
const easing = require('popmotion/easing')
const chain = require('popmotion/compositors/chain')
const delay = require('popmotion/compositors/delay')
const tween = require('popmotion/animations/tween')
const noop = require('noop')
const css = require('stylefire/css')

const emptyObject = {}

u.prototype.tween = function(arg) {
  if (typeof arg == 'string') {
    const {nodes} = this
    if (nodes.length == 0) {
      return null
    }
    const anims = nodes[0]._anims
    return anims ? anims[arg] || null : null
  }
  if (!isObject(arg)) {
    throw TypeError('Expected an object or string')
  }
  return _animate.call(this, arg)
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

function _animate(arg) {
  const {nodes} = this

  let promise
  if (nodes.length == 0) {
    promise = Promise.resolve()
    return {
      stop: noop,
      then: promise.then.bind(promise),
    }
  }

  let stopped = false
  let stop = function() {
    stopped = true
  }

  promise = new Promise((resolve, reject) => {
    let count = 0
    const anims = []

    const config = _configure(arg)
    onFrameStart(() => {
      if (stopped) return
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (!node._anims) node._anims = {}
        if (!node._style) node._style = css(node)

        for (let attr in config.to) {
          anims.push(animate(node, attr))
          count += 1
        }

        if (i == 0 && count == 1 && nodes.length == 1) {
          stop = anims[0].stop
          return
        }
      }
      stop = function() {
        anims.forEach(anim => anim._stop())
        const err = new Error('All animations were stopped')
        err.anims = anims
        reject(err)
      }
    })

    function animate(node, attr) {
      let anim = node._anims[attr]
      if (anim) anim.stop()

      anim = tween({
        to: config.to[attr],
        from: config.from[attr] || node._style.get(attr),
        ease: config.ease,
        duration: config.duration,
      })

      if (config.delay > 0) {
        anim = chain(delay(config.delay), anim)
      }

      const style = node._style
      node._anims[attr] = anim = anim.start({
        update: (val) => style.set(attr, val),
        complete() {
          delete anims[attr]
          if (--count == 0) resolve()
        }
      })

      anim.node = node
      anim.attr = attr

      anim._stop = anim.stop
      anim.stop = function() {
        delete node._anims[attr]
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
    stop: () => stop(),
    then: promise.then.bind(promise),
  }
}
