## .ready()

Pass a function that will be called when the page is fully loaded.
In particular, the `DOMContentLoaded` event of the `document` object
is used (with the `load` event of `window` as a fallback).

If you were to attach a `DOMContentLoaded` event listener manually,
your function may never be called if the event had already been
triggered. This method avoids that edge case for you!

Also, your function can return a `Promise` object to delay the execution
of any pending `.ready()` functions.

If an error is thrown or a promise is rejected, the `Error` object is
passed to `console.error` since an error during the ready event is
typically unrecoverable.

```js
u.ready(function() {
  // Promise support is included!
  return Promise.resolve()
})

u.ready(function() {
  // This is called after the promise above is resolved.
})
```
