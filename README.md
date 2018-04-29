# dough v1.0.0

The jQuery mindset re-imagined for 2018. 💸

## Features

- Fast: maybe (not yet benchmarked)
- Effective: powerful features, no bloat
- Intuitive: read less, write more
- Animatable: integrated with [Popmotion](https://github.com/popmotion/popmotion)
- Modern: written in ES6

**NOTE:** IE 10 and under are not supported (yet?)

## $

```js
// Get that money
let $ = require('dough')

// Create an element
let elem = $('div', {
  class: 'foo bar',
  children: [],
})

// Select a list of elements
let links = $('a')

// Wrap an existing node
let body = $(document.body)

// Wrap an existing node list
let elems = $(document.body.children)

// Passing null/undefined always returns the same instance
$(null) == $(undefined)

// Wrapping $ objects is a no-op
body == $(body)
```

## $.prototype

**Access:**
- attr()
- bounds
- cache()
- children()
- childNodes
- closest()
- contains()
- css()
- data()
- eq()
- find()
- findAll()
- findLast()
- first()
- firstChild
- firstNode
- hasClass()
- html()
- index
- indexOf()
- is()
- last()
- lastChild
- lastNode
- not()
- parent()
- parentNode
- prop()
- siblings()
- style
- text()

**Events:**
- off()
- on()
- once()
- trigger()

**Mutation:**
- addClass()
- after()
- append()
- appendTo()
- attr()
- before()
- css()
- data()
- empty()
- html()
- prepend()
- prependTo()
- prop()
- remove()
- removeClass()
- render()
- replace()
- scroll()
- stop()
- text()
- toggleClass()
- tween()
- wrap()

**Traversal:**
- each()
- filter()
- map()

**Other:**
- array()
- clone()

## Reference

*Documentation is forthcoming.**

