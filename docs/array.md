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

Remove all the nodes that doesn't match the criteria

```js
.filter('a')
.filter(u('a'))
.filter(function(node, i){ return u(node).is('a'); })
```


### Parameters

`filter`: it can be:
  - css selector that each of the nodes must match to stay
  - instance of umbrella with the elements to keep (the intersection will be kept)
  - function that returns a boolean with true to keep the element. It accepts two parameters, `node` and `index`, and the context of `this` is the instance of umbrella so methods like `this.slice()` are available


### Returns

An instance of Umbrella with the nodes that passed the filter.


### Examples

Get only the active links

```js
var links = u('a').filter('.active');
```

Get all of the paragraphs with a link:

```js
var paragraphs = u('p').filter(function(node){
  return u(node).find('a').length > 0;
});
```

Get only the inputs with an answer above 5 and show an error:

```js
u('input').filter(function(node, i){
  if (parseInt(u(node).first().value) > 5) {
    return true;
  }
}).addClass('error');
```


### Related

[.is()](#is) check whether one or more of the nodes is of one type

[.not()](#not) remove all the nodes that match the criteria

---
## .map()

Create a new Umbrella object by mapping over the current set of nodes.
The given function can return any value that the Umbrella constructor accepts.
Falsy values and duplicate nodes are ignored.

```js
// Get every parent node, but no duplicates.
u(nodes).map((node, index) => node.parentNode)
```
