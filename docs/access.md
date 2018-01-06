## .attr()

Handle attributes for the matched elements

```js
// GET
.attr('name');

// SET
.attr('name', 'value');
.attr({ name1: 'value', name2: 'value2' });
```


### Parameters

*GET*

`name`: the attribute that we want to get from the first matched element


*SET*

`name`: the attribute that we want to set for all of the matched elements

`value`: what we want to set the attribute to. If it's not defined, then we get the name



### Return

*GET*

`string`: the value of the attribute

*SET*

`u`: returns the same instance of Umbrella JS



### Important

You must understand that `.attr()` will only retrieve the attributes, not the properties like `checked`. To understand it better, check [jquery's attr() vs prop()](http://api.jquery.com/prop/).

Each property is different so you should consult each case. For example, if you wanted to get the property `checked` you could do:

```js
u('.terms-os-service').is(':checked');
```



### Examples

Get the alt of an image:

```js
u('img.hero').attr('alt');
```

Set the src of all of the images:

```js
u('img').attr({ src: 'demo.jpg' });
```


### Related

[.data()](#data) handle data-* attributes for the matched elements

---
## .data()

Handle data-* attributes for the matched elements

```js
// GET
.data('name');

// SET
.data('name', 'value');
.data({ name1: 'value', name2: 'value2' });
```


### Parameters

*GET*

`name`: the data-* attribute that we want to get from the first matched element


*SET*

`name`: the data-* attribute that we want to set for all of the matched elements

`value`: what we want to set the attribute to. If it's not defined, then we get the name



### Return

*GET*

`string`: the value of the data-* attribute

*SET*

`u`: data-* returns the same instance of Umbrella JS


### Examples

Get the value for data-id:

```html
<ul>
  <li data-id='0'>First</li>
  <li data-id='1'>Second</li>
  <li data-id='2'>Third</li>
</ul>
```

```js
u('ul li').first().data('id'); // 0
```

Set the data-id of an element:

```js
u('ul li').first().data({ id: '1' }); // <li data-id='1'>First</li>

u('ul li').first().data('id', '2'); // <li data-id='2'>First</li>
```


### Related

[.attr()](#attr) handle attributes for the matched elements


---
## .size()

Get the [bounding client rect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) of the first matched element. This has height, width, top, left, right and bottom properties

```js
.size()
```

### Parameters

None


### Return

Returns a simple object with the following properties referring to the first matched element:

- left
- right
- top
- height
- bottom
- width




### Examples

```js
u('body').size();
// {"left":0,"right":400,"top":0,"height":300,"bottom":300,"width":400}
```
