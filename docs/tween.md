## .tween()

Without arguments, this method returns an active animation for the
given style attribute (eg: `color`). If no animation exists,
then `null` is returned.

Otherwise, this methods creates an animation using the given options
object and starts it immediately. It returns an object with two
methods: `then` and `stop`.

Here are the available options:
- `to: object`
- `from: ?object`
- `delay: number`
- `duration: number`
- `ease: string | array | function`

The `to` and `from` objects can contain any style attribute as the key(s).
The values should be compatible with their corresponding style attribute.
If `from` is undefined (or a style attribute defined in `to` isn't defined in
the `from` object), the style attribute's current value is used.
You can use aliases for certain style attributes (eg: `x` for `translateX`).
Read more about that [here][1].

The `delay` and `duration` options are measured in milliseconds (1000 in every second).

If you pass an array to `ease`, the easing uses the [cubic bezier][2] equation.
If you pass a function, it takes a number ranging from 0 to 1, and returns a
number ranging from 0 to 1. The result can exceed the 0 to 1 range if you want
an overshoot effect.

If you need more advanced animation, use the `popmotion` library
since that's what this method uses. Read more [here][3].

[1]: https://popmotion.io/api/css/
[2]: http://cubic-bezier.com
[3]: https://popmotion.io/api/
