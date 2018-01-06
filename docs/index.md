## u()

The `u` function is your gateway into the world of Umbrella.

Here's what you can do with it:
- Find node(s) using a CSS selector
- Create node(s) using HTML markup
- Wrap existing node(s)

```js
// Find all nodes matching a given selector.
u('.blue')

// Create nodes using HTML markup.
u('<div>')

// Passing null/undefined always returns the same instance.
u()

// Passing an Umbrella object will pass it through as-is.
u(u())

// Wrap a Node, NodeList, or any other array-like Node collection.
u(nodes)

// An array of Node objects works all the same.
u([ node1, node2 ])

// DO NOT pass an array of Umbrella objects
u([ u() ])

// DO NOT pass an array of arrays
u([ nodes ])

// All other values are converted to strings and wrapped with a text node.
u(false).text() // => 'false'
```

If you pass a CSS selector, you have the option of also passing a `Node` instance,
which is used as the context for the search. The context defaults to `document.body`.

The return value is always an Umbrella object.

```js
u.is(u()) // => true

// Slower (but allows for subclassing the Umbrella constructor)
u() instanceof u // => true

// If you plan to subclass Umbrella, make sure to override `u.is`
u.is = (val) => val instanceof u
```

Every instance of Umbrella has a `nodes` array which you can access
if you want to work with `Node` instances directly.

Also, use the `length` property as a less verbose way of knowing
how many nodes are in an Umbrella object.

## u.text()

Create one or more text nodes.

```js
u.text('hello', 'world')
```
