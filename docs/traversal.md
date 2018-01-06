## .children()

Get the direct children of all of the nodes with an optional filter

```js
.children(filter);
```


### Parameters

`filter`: a string containing a selector that nodes must pass or a function that return a boolean. See [.filter()](#filter) for a better explanation



### Return

`u`: returns an instance of Umbrella JS with the new children as nodes



### Examples

Get the first `<li>` of every `<ul>`

```js
u("ul").children('li:first-child');
```



### Related

[.parent()](#parent) get all of the direct parents

[.find()](#find) get all of the descendants of the matched nodes

[.closest()](#closest) get the first ascendant that matches the selector


---
## .closest()

Find the first ancestor that matches the selector for each node

```js
.closest(filter);
```


### Parameters

`filter`: a string containing a selector that nodes must pass or a function that return a boolean. See [.filter()](#filter) for a better explanation



### Return

`u`: returns an instance of Umbrella JS with the new ancestors as nodes



### Examples

Get the ul of every li

```js
u("li").closest('ul');
```



### Related

[.find()](#find) get all of the descendants of the matched nodes

[.parent()](#parent) get all of the direct parents

[.children()](#children) get the direct children of all of the nodes with an optional filter


---
## .find()

Get all of the descendants of the nodes with an optional filter

```js
.find(filter);
```


### Parameters

`filter`: a string containing a selector that nodes must pass or a function that return a boolean. See [.filter()](#filter) for a better explanation



### Return

An instance of Umbrella with the new children as nodes



### Examples

Get all of the links within all the paragraphs

```js
u("p").find('a');
```

Get the required fields within a submitting form:

```js
u('form').on('submit', function(e){
  var required = u(this).find('[required]');
});
```



### Related

[.closest()](#closest) get the first ascendant that matches the selector

[.parent()](#parent) get all of the direct parents

[.children()](#find) get the direct child of the matched nodes


---
## .first()

Retrieve the first of the matched nodes

```js
.first();
```


### Parameters

This method doesn't accept any parameters


### Return

The first html node or false if there is none.



### Examples

Retrieve the first element of a list:

```js
var next = u("ul.demo li").first();
```



### Related

[.last()](#last) retrieve the last matched element

---
## .last()

Get the last element from a list of elements.

```js
.last();
```


### Parameters

This method doesn't accept any parameters


### Return

The last html node or false if there is none.



### Examples

Retrieve the last element of a list:

```js
var next = u("ul.demo li").last();
```



### Related

[.first()](#first) retrieve the first matched element


---
## .parent()

Retrieve each parent of the matched nodes, optionally filtered by a selector

```js
.parent()
.parent('p')
.parent(u('p'))
.parent(function(node, i){})
```


### Parameters

`selector`: Optional filter argument for the parents



### Examples

Retrieve all of the parents of `<li>` in the page:

```js
u('li').parent();
```

Retrieve all the paragraphs that have a link as a direct child

```js
u('a').parent('p');
```


### Related

[.children()](#parent) get all of the direct children

[.find()](#find) get all of the descendants of the matched nodes

[.closest()](#closest) get the first ascendant that matches the selector

---
## .siblings()

Get the siblings of all of the nodes with an optional filter

```js
.siblings(selector);
```


### Parameters

`selector`: a string containing a selector that nodes must pass or a function that return a boolean. See [.filter()](#selector) for a better explanation



### Return

`u`: returns an instance of Umbrella JS with the new siblings as nodes



### Examples

Get the all the siblings of the hovered `<li>`

```js
u("li:hover").siblings('li:first-child');
```

Get all the siblings

```js
u("li").siblings();
```



### Related

[.parent()](#parent) get all of the direct parents

[.find()](#find) get all of the descendants of the matched nodes

[.closest()](#closest) get the first ascendant that matches the selector

[.children()](#closest) get the direct children of all of the nodes with an optional filter
