
const u = require('./core')

u.prototype.on = function(arg, listener, captures) {
  return this.eacharg(arg, (node, eventId) =>
    addListener(node, eventId, listener, captures))
}

u.prototype.off = function(arg, listener) {
  return this.eacharg(arg, (node, eventId) =>
    removeListener(node, eventId, listener))
}

u.prototype.trigger = function(arg, props) {
  const {nodes} = this
  if (nodes.length) {
    this.args(arg).forEach(eventId => {
      if (typeof eventId == 'string') {
        const event = createEvent(eventId, props)
        for (let i = 0; i < nodes.length; i++) {
          nodes[i].dispatchEvent(event)
        }
      }
    })
  }
  return this
}

//
// Helpers
//

function addListener(node, eventId, listener, captures) {
  node.addEventListener(eventId, listener, captures || false)
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
    events.forEach(listener =>
      node.removeEventListener(eventId, listener))
    delete node._e[eventId]
  }
}

function createEvent(eventId, props) {
  const eventType = nativeEvents[eventId] || Event
  const bubbles = eventType == Event ?
    props.bubbles !== false : nativeBubbles.indexOf(eventId) > -1

  const event = new eventType(eventId, {bubbles, cancelable: true})
  if (props) {
    Object.assign(event, props)
  }
  return event
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
