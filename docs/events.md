## .off()

Remove event handler from matched nodes

```js
.off('event1')
.off('event1 event2 eventN')
.off('event1,event2,eventN')
.off(['event1', 'event2', 'eventN'])
```


### Parameters

`event`:
  Any number of events (such as click, mouseover)

`listener`:
  Function reference to remove from the events



### Examples

```html
<ul>
  <li class="off-single-test">1</li>
  <li class="off-multiple-test">2</li>
  <li class="off-multiple-test">3</li>
</ul>
```

```js
const listener = function() {
  alert('called');
}

//Add listener
u('.off-multiple-test').on('click', listener);
//Trigger event
u('.off-multiple-test').trigger('click'); //Alert appears
//Remove listener
u('.off-multiple-test').off('click', listener);
//Trigger event
u('.off-multiple-test').trigger('click'); //No alert
```

### Related

[.on()](#on) Attaches an event to matched nodes

[.handle()](#handle) Same as `.on()`, but it prevents the default action

[.trigger()](#trigger) Triggers an event on all of the matched nodes


---
## .on()

Calls a function when an event is triggered

```js
.on('event1', callback)
.on('event1 event2 eventN', callback)
.on('event1,event2,eventN', callback)
.on(['event1', 'event2', 'eventN'], callback)
.on('event1', 'selector', callback)
```



### Parameters

`event1`, `event2`, `eventN`: the name(s) of the events to listen for actions, such as `click`, `submit`, `change`, etc.

`callback`: function that will be called when the event is triggered. The parameters it accepts are `function(e, data1, data2, ..., dataN)`:

  - `e`: the event that was triggered. It has some interesting properties:

    - `e.currentTarget`: Contains the element that triggered the event.
    - `e.preventDefault()`: Avoids the browser from performing the default action.
    - `e.details`: an array of the argument data passed to `trigger()` if it was passed with that function. See other arguments:

  - `data1`, `data2`, `dataN`: the arguments that were passed to `trigger()` if it was called with that function.

Another way is doing event delegation, for which the parameters are:

`event1`, `event2`, `eventN`: same as before

`selector`: a css selector that matches the nodes that will trigger it

`callback`: same as before


### Return

Umbrella instance



### Examples

An auto-save feature that submits the form through ajax every 10 seconds

```js
// Show 'test' when the button test is clicked
u('button.test').on('click', function(e) {
  alert("Test");
});

// This example is very similar to .ajax() implementation
u('form.test').on('submit', function(e){

  // Avoid submitting the form normally
  e.preventDefault();

  // Submit the form through ajax
  ajax(u(this).attr('action'), u(this).serialize());
});

// Better 'onchange':
u('input').on('change click blur paste', function(){
  console.log("Maybe changed");
});
```



### Related

[.handle()](#off) Same as `.on()`, but it prevents the default action

[.trigger()](#trigger) calls an event on all of the matched nodes

[.off()](#off) Removes an event from  matched nodes


---
## .trigger()

Calls an event on all of the matched nodes

```js
.trigger('event1', data)
.trigger('event1 event2 eventN', data1, data2, dataN)
.trigger('event1,event2,eventN', data1, data2, dataN)
.trigger(['event1', 'event2', 'eventN'], data1, data2, dataN)
```



### Parameters

`event1`, `event2`, `eventN`: the name(s) of the events to listen for actions, such as `click`, `submit`, `change`, etc.

`data1`, `data2`, `dataN` (optional): the data that will be passed to the event listener in the `e.details` variable and as arguments.


### Return

Umbrella instance



### Examples

An auto-save feature that submits the form through ajax every 10 seconds

```js
// Make the form to submit through ajax
u('form.edit').ajax();

// Submit it every 10s
setInterval(function(){
  u('form.edit').trigger('submit');
}, 10000);
```


### Related

[.on()](#on) add an event listener to the matched nodes

[.handle()](#off) Same as `.on()`, but it prevents the default action

[.off()](#off) Removes an event from matched nodes
