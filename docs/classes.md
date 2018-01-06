## .addClass()

Add html class(es) to all of the matched elements.

```js
.addClass('name1')
.addClass('name1 name2 nameN')
.addClass('name1,name2,nameN')
.addClass('name1', 'name2', 'nameN')
.addClass(['name1', 'name2', 'nameN'])
.addClass(['name1', 'name2'], ['name3'], ['nameN'])
.addClass(function(){ return 'name1'; })
.addClass(function(){ return 'name1'; }, function(){ return 'name2'; })
```

### Parameters

`name1`, `name2`, `nameN`: the class name (or variable containing it) to be added to all of the matched elements. It accepts many different types of parameters (see above).



### Return

`u`: returns the same instance of Umbrella JS



### Examples

Add the class `main` to all the `<h2>` from the page:

```js
u("h2").addClass("main");
```

Add the class `toValidate` and `ajaxify` to all the `<form>` present in the page:

```js
u("form").addClass("toValidate", "ajaxify");
```



### Related

[.hasClass()](#hasclass) finds if the matched elements contain the class(es).

[.removeClass()](#removeclass) deletes class(es) from the matched elements.

[.toggleClass()](#toggleclass) adds or removes the class


---
## .hasClass()

Find if any of the matched elements contains the class passed:

```js
.hasClass('name1');
.hasClass('name1 name2 nameN');
.hasClass('name1,name2,nameN');
.hasClass('name1', 'name2', 'nameN');
.hasClass(['name1', 'name2', 'nameN']);
.hasClass(['name1', 'name2'], ['name3'], ['nameN']);
.hasClass(function(){ return 'name1'; });
.hasClass(function(){ return 'name1'; }, function(){ return 'name2'; });
```

If more than one class is passed, they are checked **with the AND condition** similar to:

```js
u("a").hasClass("button") && u("a").hasClass("primary");
```


### Parameters

`name1`, `name2`, `nameN`: the class name (or variable containing it) to be matched to any of the matched elements. It accepts many different types of parameters (see above).


### Return

**`boolean`**: returns true if all of the passed classes are found in any of the matched elements and false if they couldn't be found.



### Example

You can also check manually if it has several classes with the OR parameter with:

```js
u('a').is('.button, .primary');
```

And with the AND parameter:

```js
u('a').is('.button.primary');
```


Toggle the color of a button depending on the status

```html
<a class="example button">Click me</a>

<script src="//umbrellajs.com/umbrella.min.js"></script>
<script>
  u(".example").on('click', function() {
    if(u(this).hasClass("error")) {
      u(this).removeClass("error").html("Click me");
    } else {
      u(this).addClass("error").html("Confirm");
    }
  });
</script>
```


### Related

[.addClass()](#addclass) adds html class(es) to each of the matched elements.

[.removeClass()](#removeclass) deletes class(es) from the matched elements.


---
## .is()

Check whether any of the nodes matches the selector

```js
.is('a')
.is(u('a'))
.is(function(){ return Math.random() > 0.5 })
```



### Parameters

`filter`: it can be two things:
  - css selector to check
  - instance of umbrella with the elements to check
  - function that returns a boolean to check for each of the nodes. If one of them returns true, then the method `is()` returns true. It accepts two parameters, `node` and `index`, and the context of `this` is the instance of umbrella so methods like `this.slice()` are available.



### Return

*boolean*: *true* if any of the nodes matches the selector or the function returns true, false otherwise.



### Examples

Check if the current form needs to be valdated

```js
u('form.subscribe').ajax(false, function() {
  
  // Same as u('form.subscribe').hasClass('validate')
  if (u('form.subscribe').is('.validate')) {
    validate();
  }
});
```



### Related

[.filter()](#filter) remove unwanted nodes

[.not()](#not) remove all the nodes that match the criteria

---
## .not()

Remove known nodes from nodes

```js
.not('a')
.not(u('a'))
.not(function(node){ return Math.random() > 0.5; })
```


### Parameters

`not`: it can be two things (in order):
  - css selector that each of the nodes must **not** match to stay
  - instance of umbrella with the element to remove
  - function that returns `true` to remove the element. It accepts **one parameter**, and the context of `this` is the instance of umbrella so methods like `this.slice()` are available

```js
.not(function(node){
  // your code
});
```



### Examples

```html
<ul class="menu">
    <li><a class="active">Menu item 1</a></li>
    <li><a>Menu item 2</a></li>
    <li><a>Menu item 3</a></li>
</ul>
```

Get only the non-active links on paragraphs

```js
var nonactive_links = u('.menu a').not('.active');
```

Get all of the active:

```js
active_links = u('.menu a').not(nonactive_links);
```


### Related

[.is()](#is) check whether one or more of the nodes is of one type

[.filter()](#filter) Remove unwanted nodes


---
## .removeClass()

Remove html class(es) to all of the matched elements.

```js
.removeClass('name1');
.removeClass('name1 name2 nameN');
.removeClass('name1,name2,nameN');
.removeClass('name1', 'name2', 'nameN');
.removeClass(['name1', 'name2', 'nameN']);
.removeClass(['name1', 'name2'], ['name3'], ['nameN']);
.removeClass(function(){ return 'name1'; });
.removeClass(function(){ return 'name1'; }, function(){ return 'name2'; });
```


### Parameters

`name1`, `name2`, `nameN`: the class name (or variable containing it) to be removed to all of the matched elements. It accepts many different types of parameters (see above).



### Return

`u`: returns the same instance of Umbrella JS



### Examples

Remove the class `main` to all the `<h2>` from the page:

```js
u("h2").removeClass("main");
```

Remove the class `toValidate` and `ajaxify` to all the `<form>` present in the page:

```js
u("form").removeClass("toValidate", "ajaxify");
```

### Related

[.addClass()](#addclass) adds class(es) from the matched elements.

[.hasClass()](#hasclass) finds if the matched elements contain the class(es)


---
## .toggleClass()

Toggles html class(es) to all of the matched elements.

```js
.toggleClass('name1');
.toggleClass('name1 name2 nameN');
.toggleClass('name1,name2,nameN');
.toggleClass(['name1', 'name2', 'nameN']);
.toggleClass('name1', forceAdd);
```

### Parameters

`name1`, `name2`, `nameN`: the class name (or variable containing it) to be toggled to all of the matched elements. It accepts many different types of parameters (see above).

`forceAdd`: boolean telling the method whether to force an `.addClass()` (true) or `.removeClass()` (false).



### Return

`u`: returns the same instance of Umbrella JS



### Examples

Add the class `main` to all the `<h2>` from the page:

```js
u("h2").toggleClass("main");
```

Add the class `toValidate` and remove `ajaxify` from the element `<form class="ajaxify">` present in the page:

```js
u("form.ajaxify").toggleClass("toValidate ajaxify");
```

Force an `.addClass()` on the element `<h2>` from the page:

```js
u("h2").toggleClass("main", true);
```

Note however that this last example by itself doesn't make much sense as you could just use `addClass()` instead. It makes a lot more sense when the second parameter is checked dynamically:

```js
u("h2").toggleClass("main", u('.accept').is(':checked'));
```



### Related

[.addClass()](#addclass) adds class(es) from the matched elements.

[.removeClass()](#removeclass) deletes class(es) from the matched elements.

[.hasClass()](#hasclass) finds if the matched elements contain the class(es)
