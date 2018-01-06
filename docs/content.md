## .after()

Add some html as a sibling after each of the matched elements.

```js
.after(html)

.after('<div>')
.after(u('<div>'))
.after(u('<div>').first()) // Same as document.createElement('div')
.after(u('<div></div><div></div>'))
.after(function(){})
.after(function(el){}, elements)
.after(function(el){}, 10)
```



### Parameters

`html = ""`:
  - Any of these elements:
    - **string** containing the html that is going to be inserted
    - **instance of Umbrella**
    - **HTML node**
    - **array** containing HTML nodes
  - A callback that returns any of the previous. It gets passed these parameters:
    - **el**: the current element from the elements parameter, {} if none is specified and i if elements is number
    - **i**: the index of the current element

`elements = [{}]` (optional): It can be any of the following:
  - An array of elements that will be passed to the callback. The callback is executed once per element, and all of them are added consecutively.
  - A css selector, so the function will be executed once per matched element.
  - A number, in which case the function will be executed that number of times



### Return

`u`: returns the same instance of Umbrella JS



### Examples

Add a separator `<hr>` after each of the main titles h1:

```js
u("h1").after("<hr>");
```

Add three elements after the link. All of these methods are equivalent:

```js
// Add them all like a single string
u("a.main").after("<a>One</a><a>Two</a><a>Three</a>");

// Add them in a chain
u("a.main").after("<a>Three</a>").after("<a>Two</a>").after("<a>One</a>");

// Add them with a function parameter
var cb = function(txt){ return "<a>" + txt + "</a>" };
u("a.main").after(cb, ["One", "Two", "Three"]);

// Same as the previous one but with ES6
u("a.main").after(txt => `<a>${ txt }</a>`, ["One", "Two", "Three"]);
```

They all result in:

```html
<!-- previous data -->

<a class="main"></a>
<a>One</a>
<a>Two</a>
<a>Three</a>
```


You can also add some events to them by creating an html node:

```js
function greeting(){ alert("Hello world"); }

u("a.main").after(function(){
  return u('<a>').addClass('hi').on('click', greeting).html("Greetings!");
});
```



### Related

[.before()](#before) Add some html before each of the matched elements.

[.append()](#append) Add some html as a child at the end of each of the matched elements

[.prepend()](#prepend) Add some html as a child at the beginning of each of the matched elements.


---
## .append()

Add some html as a child at the end of each of the matched elements

```js
.append(html)

.append('<div>')
.append(u('<div>'))
.append(u('<div>').first()) // Same as document.createElement('div')
.append(u('<div></div><div></div>'))
.append(function(){})
.append(function(el){}, elements)
.append(function(el){}, 10)
```



### Parameters

`html = ""`:
  - Any of these elements:
    - **string** containing the html that is going to be inserted
    - **instance of Umbrella**
    - **HTML node**
    - **array** containing HTML nodes
  - A callback that returns any of the previous. It gets passed these parameters:
    - **el**: the current element from the elements parameter, {} if none is specified and i if elements is number
    - **i**: the index of the current element

`elements = [{}]` (optional): It can be any of the following:
  - An array of elements that will be passed to the callback. The callback is executed once per element, and all of them are added consecutively.
  - A css selector, so the function will be executed once per matched element.
  - A number, in which case the function will be executed that number of times



### Return

`u`: returns the same instance of Umbrella JS



### Examples

Add a footer to each of the articles

```js
u("article").append("<footer>Hello world</footer>");
```

Add three elements to the list. All of these methods are equivalent:

```js
// Add them all like a single string
u("ul").append("<li>One</li><li>Two</li><li>Three</li>");

// Add them in a chain
u("ul").append("<li>One</li>").append("<li>Two</li>").append("<li>Three</li>");

// Add them with a function parameter
var cb = function(txt){ return "<li>" + txt + "</li>" };
u("ul").append(cb, ["One", "Two", "Three"]);

// Same as the previous one but with ES6
u("ul").append(txt => `<li>${ txt }</li>`, ["One", "Two", "Three"]);
```

They all result in:

```html
<ul>
  <!-- previous data -->

  <li>One</li>
  <li>Two</li>
  <li>Three</li>
</ul>
```

You can also add some events to them by creating an html node:

```js
function greet(){ alert("Hello world"); }

u("a.main").append(function(){
  return u('<a>').addClass('hi').on('click', greet).html("Hey!");
});
```



### Related

[.prepend()](#prepend) Add some html as a child at the beginning of each of the matched elements.

[.before()](#before) Add some html before each of the matched elements.

[.after()](#after) Add some html as a sibling after each of the matched elements.


---
## .before()

Add some html before each of the matched elements.

```js
.before(html)

.before('<div>')
.before(u('<div>'))
.before(u('<div>').first()) // Same as document.createElement('div')
.before(u('<div></div><div></div>'))
.before(function(){})
.before(function(el){}, elements)
.append(function(el){}, 10)
```



### Parameters

`html = ""`:
  - Any of these elements:
    - **string** containing the html that is going to be inserted
    - **instance of Umbrella**
    - **HTML node**
    - **array** containing HTML nodes
  - A callback that returns any of the previous. It gets passed these parameters:
    - **el**: the current element from the elements parameter, {} if none is specified and i if elements is number
    - **i**: the index of the current element

`elements = [{}]` (optional): It can be any of the following:
  - An array of elements that will be passed to the callback. The callback is executed once per element, and all of them are added consecutively.
  - A css selector, so the function will be executed once per matched element.
  - A number, in which case the function will be executed that number of times



### Return

`u`: returns the same instance of Umbrella JS



### Examples

Add a header to each of the articles

```js
u("article").after("<header>Hello world</header>");
```

Add three elements before the link. All of these methods are equivalent:

```js
// Add them all like a single string
u("a.main").before("<a>One</a><a>Two</a><a>Three</a>");

// Add them in a chain
u("a.main").before("<a>One</a>").before("<a>Two</a>").before("<a>Three</a>");

// Add them with a function parameter
var cb = function(txt){ return "<a>" + txt + "</a>" };
u("a.main").before(cb, ["One", "Two", "Three"]);

// Same as the previous one but with ES6
u("a.main").before(txt => `<a>${ txt }</a>`, ["One", "Two", "Three"]);
```

They all result in:

```html
<a>One</a>
<a>Two</a>
<a>Three</a>
<a class="main"></a>

<!-- previous data -->
```


You can also add some events to them by creating an html node:

```js
function greeting(){ alert("Hello world"); }

u("a.main").before(function(){
  return u('<a>').addClass('hi').on('click', greeting).html("Greetings!");
});
```



### Related

[.after()](#after) Add some html as a sibling after each of the matched elements.

[.append()](#append) Add some html as a child at the end of each of the matched elements

[.prepend()](#prepend) Add some html as a child at the beginning of each of the matched elements.


---
## .empty()

Remove all child nodes of the matched elements.

```js
.empty();
```


### Parameters

This method doesn't accept any parameters


### Return

`u`: Returns an instance of Umbrella JS with the empty nodes.


### Examples

Removes all child nodes from all containers:

```js
u("div.container").empty();
```


### Related

[.remove()](#remove) Removes the matched elements.


---
## .html()

Retrieve or set the html of the elements:


```js
// GET
.html();

// SET
.html(html);
```


### Parameters

*GET*
should pass no parameter so it retrieves the html.

*SET*
`html`: the new value that you want to set. To remove it, pass an empty string: `""`



### Return

*GET*
`string`: the html of the first node

*SET*
`u`: returns the same instance of Umbrella JS



### Examples

Get the main title:

```js
var title = u('h1').html();
```

Set the main title:

```js
u('h1').html('Hello world');
```


### Related

[.text()](#attr) Retrieve or set the textContent of the elements

[.attr()](#attr) Handle attributes for the matched elements


---
## .prepend()

Add some html as a child at the beginning of each of the matched elements.

```js
.prepend(html)

.prepend('<div>')
.prepend(u('<div>'))
.prepend(u('<div>').first()) // Same as document.createElement('div')
.prepend(u('<div></div><div></div>').nodes)
.prepend(function(){})
.prepend(function(el){}, elements)
.prepend(function(el){}, 10)
```



### Parameters

`html = ""`:
  - Any of these elements:
    - **string** containing the html that is going to be inserted
    - **instance of Umbrella**
    - **HTML node**
    - **array** containing HTML nodes
  - A callback that returns any of the previous. It gets passed these parameters:
    - **el**: the current element from the elements parameter, {} if none is specified and i if elements is number
    - **i**: the index of the current element

`elements = [{}]` (optional): It can be any of the following:
  - An array of elements that will be passed to the callback. The callback is executed once per element, and all of them are added consecutively.
  - A css selector, so the function will be executed once per matched element.
  - A number, in which case the function will be executed that number of times



### Return

`u`: returns the same instance of Umbrella JS



### Examples

Add a header to each of the articles

```js
u("article").prepend("<header>Hello world</header>");
```

Add three elements at the beginning of the list. All of these methods are equivalent:

```js
// Add them all like a single string
u("ul").prepend("<li>One</li><li>Two</li><li>Three</li>");

// Add them in a chain
u("ul").prepend("<li>Three</li>").append("<li>Two</li>").append("<li>One</li>");

// Add them with a function parameter
var cb = function(txt){ return "<li>" + txt + "</li>" };
u("ul").prepend(cb, ["One", "Two", "Three"]);

// Same as the previous one but with ES6
u("ul").prepend(txt => `<li>${ txt }</li>`, ["One", "Two", "Three"]);
```

They all result in:

```html
<ul>
  <li>One</li>
  <li>Two</li>
  <li>Three</li>

  <!-- previous data -->
</ul>
```

You can also add some events to them by creating an html node:

```js
function greeting(){ alert("Hello world"); }

u("a.main").prepend(function(){
  return u('<a>').addClass('hi').on('click', greeting).html("Greetings!");
});
```



### Related

[.append()](#append) Add some html as a child at the end of each of the matched elements

[.before()](#before) Add some html before each of the matched elements.

[.after()](#after) Add some html as a sibling after each of the matched elements.


---
## .remove()

Removes the matched elements.

```js
.remove();
```


### Parameters

This method doesn't accept any parameters


### Return

`u`: Returns an instance of Umbrella JS with the removed nodes.


### Examples

Remove all the elements of a list:

```js
u("ul.demo li").remove();
```


---
## .replace()

Replace the matched elements with the passed argument.

```js
.replace();
```

### Parameters

The parameter can be any of these types:
  - string:  html tag like `<div>`
  - function: a function which returns an html tag.


### Return

The newly created element.



### Examples

Replace elements with class 'save' by a button with class 'update':

```js
u('.save').replace('<button class="update">Update</button>');
```

Replace element button by a link with class 'button':

```js
u('button').replace(function(btn){
  return '<a class="button">' + btn.innerHTML + '</a>';
});
```


---
## .text()

Retrieve or set the text content of matched elements:


```js
// GET
.text();

// SET
.text(text);
```


### Parameters

*GET*
should pass no parameter so it retrieves the text from the first matched element.

*SET*
`html`: the new text content that you want to set for all of the matched elements. To remove it, pass an empty string: `""`



### Return

*GET*
`string`: the text content of the first matched element

*SET*
`u`: returns the same instance of Umbrella JS



### Examples

Get the main title text:

```js
var title = u('h1').text();
```

Set the main title text:

```js
u('h1').text('Hello world');
```


### Related

[.html()](#html) Retrieve or set the HTML of matched elements


---
## .wrap()

Wraps the matched element(s) with the passed argument. The argument gets processed with the constructor u() and it accepts an html tag like ```.wrap('<div>')```

```js
.wrap(selector);
```


### Parameters

`selector`: a formatted string of the desired selector. For example ```.wrap('<div>')```. Nested selectors are supported in a similar way to [jQuery wrap](http://api.jquery.com/wrap/). For example ```.wrap('<div class="a1"><div class="b1"><div class="c1"></div></div></div>')```. Matched element(s) will be wrapped with innermost node of the first child of a nested argument. See examples below.



### Return

`u`: returns an instance of Umbrella JS with the wrapped node(s)



### Examples

Wrap an element in an html element:

Original element:
```html
<button class="example">Link1</button>
```

```js
u(".example").wrap('<a class="wrapper">');
```

Result:
```html
<a class="wrapper">
  <button class="example">Link1</button>
</a>
```

Wrap an element in an html element and chain umbrella.js methods:

```js
u(".example").wrap('<a>').attr({class: "wrapper", href: "http://google.com"});
```

Result:
```html
<a href="http://google.com" class="wrapper">
  <button class="example">Link1</button>
</a>
```

Wrap several elements in an html element

```html
<button class="example">Link1</button>
<button class="example">Link2</button>
<button class="example">Link3</button>

```

```js
u(".example").wrap('<a>').attr({class: "wrapper", href: "http://google.com"});
```

Result:
```html
<a href="http://google.com" class="wrapper">
  <button class="example">Link1</button>
</a>
<a href="http://google.com" class="wrapper">
  <button class="example">Link2</button>
</a>
<a href="http://google.com" class="wrapper">
  <button class="example">Link3</button>
</a>
```

Nested selector arguments:

```html
<button class="example">Link1</button>
```

```js
u(".example").wrap('<div class="a1"><div class="b1"><div class="c1"></div></div></div>');
```

Result:
```html
<div class="a1">
	<div class="b1">
		<div class="c1">
			<a href="http://google.com" class="wrapper">
			  <button class="example">Link1</button>
			</a>
		</div>
	</div>
</div>
```

Nested selector arguments with multiple child nodes:

```html
<button class="example">Link1</button>
```

```js
u(".example").wrap('<div class="a1"><div class="b1"><div class="c1"></div></div><div class="b2"><div class="c2"><div class="d1"></div></div></div></div>');
```

Result:
```html
<div class="a1">
	<div class="b1">
		<div class="c1">
			<a href="http://google.com" class="wrapper">
			  <button class="example">Link1</button>
			</a>
		</div>
	</div>
	<div class="b2">
		<div class="c2">
			<div class="d1"></div>
		</div>
	</div>
</div>
```