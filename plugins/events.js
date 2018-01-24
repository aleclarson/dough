
const u = require('./core')
const impl = u.prototype

impl.on = function(arg, listener, captures) {
  return this._apply(u._split(arg), (node, eventId) =>
    addListener(node, eventId, listener, captures))
}

// NOTE: This method breaks in strict mode.
impl.once = function(arg, listener, captures) {
  let once = listener._once
  if (!once) listener._once = once = function(event) {
    removeListener(this, event.type, once)
    listener.call(this, event)
  }
  return this.on(arg, once, captures)
}

impl.off = function(arg, listener) {
  // Check for one-time listeners.
  if (listener && listener._once) {
    listener = listener._once
  }
  return this._apply(u._split(arg), (node, eventId) =>
    removeListener(node, eventId, listener))
}

impl.trigger = function(arg, props) {
  return this._apply(u._split(arg), (node, eventId) =>
    node.dispatchEvent(createEvent(eventId, props)))
}

//
// Helpers
//

function addListener(node, eventId, listener, captures = false) {
  listener._captures = captures
  node.addEventListener(eventId, listener, captures)
  if (!node._e) node._e = {}
  const listeners = node._e[eventId]
  if (listeners) {
    listeners.push(listener)
  } else {
    node._e[eventId] = [listener]
  }
}

function removeListener(node, eventId, listener) {
  const listeners = node._e && node._e[eventId]
  if (!listeners) return
  if (listener) {
    const index = listeners.indexOf(listener)
    if (index > -1) {
      node.removeEventListener(eventId, listener)
      if (listeners.length > 1) {
        listeners.splice(index, 1)
      } else {
        delete node._e[eventId]
      }
    }
  } else {
    listeners.forEach(listener =>
      node.removeEventListener(eventId, listener))
    delete node._e[eventId]
  }
}

function createEvent(eventId, props) {
  const eventType = nativeEvents[eventId] || Event
  const bubbles = eventType == Event ?
    props.bubbles !== false : nativeBubbles.indexOf(eventId) > -1

  const event = new eventType(eventId, {bubbles, cancelable: true})
  if (props) addProps(event, props)
  return event
}

function addProps(event, props) {
  const keys = Object.keys(props)
  const config = {enumerable: true, configurable: true}
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (key != 'bubbles') {
      config.value = props[key]
      Object.defineProperty(event, key, config)
    }
  }
}

// Native types
const ui = UIEvent
const focus = FocusEvent
const input = InputEvent
const mouse = MouseEvent
const keyboard = KeyboardEvent

// Native events
const nativeEvents = {
  load: ui,
  unload: ui,
  abort: ui,
  error: ui,
  select: ui,
  change: ui,
  submit: ui,
  reset: ui,
  resize: ui,
  scroll: ui,
  focusin: focus,
  focus: focus,
  focusout: focus,
  blur: focus,
  beforeinput: input,
  input: input,
  click: mouse,
  dblclick: mouse,
  mouseenter: mouse,
  mouseover: mouse,
  mousedown: mouse,
  mousemove: mouse,
  mouseup: mouse,
  mouseout: mouse,
  mouseleave: mouse,
  keydown: keyboard,
  keyup: keyboard,
}

// https://www.w3.org/TR/DOM-Level-3-Events
const nativeBubbles = [
  'select', 'focusin', 'focusout', 'beforeinput', 'input',
  'click', 'dblclick', 'mouseover', 'mousedown', 'mousemove',
  'mouseup', 'mouseout', 'keydown', 'keyup',
]
