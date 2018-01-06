## .array()

Call the given function for every node in the set.
The function can return anything that the Umbrella constructor accepts,
but falsy values are ignored. The return values are combined into
a single array of DOM nodes.

If no function is passed, the entire node set is returned in a new array.

**NOTE:** The resulting array does not deduplicate the node set.
You should use the `map()` method for that.

```js
// Create an array of the even DOM nodes in the set.
u(nodes).array((node, index) => index % 2 ? null : node)

// Create an array of the entire set of DOM nodes.
u(nodes).array()
```

---
## .each()

Loop through all of the nodes and execute a callback for each

```js
.each(function(node, i){});
```


### Parameters

`callback`: the function that will be called. It accepts two parameters, the node and the index. `this` is Umbrella's instance so other methods like `this.args()` and `this.slice()` are available.



### Return

`u`: returns an instance of Umbrella JS with the same nodes



### Examples

Loop through all of the links and add them a `target="_blank"`:

```js
u('a').each(function(node, i){
  u(node).attr({ target: '_blank' });
});
```

---
## .filter()

Create a new Umbrella object with the nodes that match the given predicate.

The first argument can be:
- a CSS selector
- an Umbrella object (in which the node must exist)
- a `(node, index) => boolean` function

```js
// Get every node with a specific class.
u(nodes).filter((node, index) => node.classList.has('foo'))
```

---
## .map()

Create a new Umbrella object by mapping over the current set of nodes.
The given function can return any value that the Umbrella constructor accepts.
Falsy values and duplicate nodes are ignored.

```js
// Get every parent node, but no duplicates.
u(nodes).map((node, index) => node.parentNode)
```
