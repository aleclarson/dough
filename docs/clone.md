## .clone()

Create a deep copy of every node in the set.
All event listeners are copied for every descendant.

```js
u(nodes).clone()
```

The values of `<select>` and `<textarea>` nodes would typically
be lost if you were to use `cloneNode` directly. This method prevents
that scenario for you.

You can extend the clone method like so:
```js
const {mirror} = u.prototype

// The `src` and `dest` arguments are raw nodes.
mirror.something = function(src, dest) {
  dest.something = src.something
}
```
