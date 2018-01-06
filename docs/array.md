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

Change the content of the current instance by looping each element

```js
.map(function(){});
```


### Parameters

A single callback that returns the element(s) that are going to be kept:

```js
var links = u('.special li').map(function(node, i){
  if (parseInt(node.innerHTML) > 10) {
    return '<a>' + u(node).data('id') + '</a>';
  }
}).addClass('expensive');
```

It can return a value that evaluates to false, a single element, an string, an array or an Umbrella instance. It will **remove duplicated nodes** from the result.

> Note: Umbrella JS is made to manipulate HTML nodes so it will consider the string "" and 0 as false and remove them. Return an HTML node or an HTML string to keep the elements.



### Return

An instance of Umbrella with the nodes passed



### Examples

Get the parent elements (see [.parent()](#parent)):

```js
var lists = u('li').map(function(node){ return node.parentNode });
```



### Related

[.each()](#each) loop all the elements without changing them
