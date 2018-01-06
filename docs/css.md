## .css()

- Synchronous access to the first node's `style` property.
- Asynchronous mutation of all nodes' `style` properties.

```js
const links = u('a')

// Get `style.color` of the first link element.
const color = links.css('color')

// Set `style.color` and `style.background` of every link element.
links.css('color', 'blue').css('background', 'white')

// Do the same thing, but with an object.
links.css({
  color: 'blue',
  background: 'white',
})
```

Using [`framesync`][1], all mutation is scheduled to be performed during the
`onFrameRender` step. The [`stylefire`][2] library is used to cache any
properties which are accessed using `.css(attr)`.

[1]: https://github.com/Popmotion/framesync
[2]: https://github.com/Popmotion/stylefire
