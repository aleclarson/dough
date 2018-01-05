
# Changelog

This is the list of changes I've made so far:

### Changed

- `first()` now returns an Umbrella object
- `last()` now returns an Umbrella object

### Added

- `eq()` similar to [jQuery `eq`](https://api.jquery.com/eq/)
- `index()` similar to [jQuery `index`](https://api.jquery.com/index/)
- `css()` using [stylefire](https://github.com/Popmotion/stylefire)
- `animate()` using [popmotion](https://github.com/Popmotion/popmotion)
- `tween()` for getting an active animation
- `stop()` for stopping an active animation
- `get()` for accessing custom node state
- `set()` for mutating custom node state
- `firstNode` getter
- `lastNode` getter
- `parentNode` getter
- `childNodes` getter

### Removed

- [Grunt](https://github.com/gruntjs/grunt) scripts
- `ajax()` since I use another request library
- `param()`
- `serialize()`

