
# Changelog

This is the list of changes I've made so far:

### Changed

- rename `size()` method to `bounds` getter
- `append()` and friends no longer support a function argument
- `append()` and friends now take variable arguments to append
- `first()` now returns an Umbrella object
- `last()` now returns an Umbrella object
- many performance improvements 

### Added

- `u.is()` for checking if a value is an Umbrella object
- `u.isNode()` for checking if a value is an element
- `u.isText()` for checking if a value is a text node
- `u.text()` for creating one or more text nodes
- `ready()` similar to [jQuery `ready`](https://api.jquery.com/ready/)
- `eq()` similar to [jQuery `eq`](https://api.jquery.com/eq/)
- `index()` similar to [jQuery `index`](https://api.jquery.com/index/)
- `appendTo()` method
- `prependTo()` method
- `once()` for attaching one-time listeners
- `css()` using [stylefire](https://github.com/Popmotion/stylefire)
- `animate()` using [popmotion](https://github.com/Popmotion/popmotion)
- `tween()` for getting an active animation
- `stop()` for stopping an active animation
- `prop()` similar to [jQuery `prop`](https://api.jquery.com/prop/)
- `firstChild` getter
- `lastChild` getter
- `firstNode` getter
- `lastNode` getter
- `parentNode` getter
- `childNodes` getter
- `trigger()` can now simulate native events
- custom events can set `bubbles: false` to prevent bubbling
- event capturing can be enabled by passing `true` as last argument to `on()` or `once()`

### Removed

- [Grunt](https://github.com/gruntjs/grunt) scripts
- `ajax()` since I use another request library
- `param()`
- `serialize()`
- `replace()`

### Roadmap

- `get()` for accessing custom node state
- `set()` for mutating custom node state
- `width()` and `height()`
- `offset()` and `position()`
- `contains()`

