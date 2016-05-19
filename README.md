# set-aside

Using a side storage (`WeakMap`) to create property setter hooks on an object.

## API

### `setAside.sideStore(obj)`
Gives you the "side storage" object for an object.  Uses `WeakMap` where available, or a non-enumerable property containing the side storage object where not.

### `setAside.sideSet(obj, key, {before, after})`
Create a get/set property named `key` on the object using `defineProperty`.  If the property was already a `get/set` property, it will chain onto the current getter and setter.  If passed `before` and `after` can be functions with the argument list `(newValue, oldValue, thisArg)`.  The `thisArg` is passed in to make using arrows here a bit easier if you want.

### `setAside.beforeSet(obj, key, hook)`
### `setAside.afterSet(obj, key, hook)`
The `hook` should look like `function( newValue, oldValue, thisArg ) {}`.  Just an alias for `sideSet`

## Examples

```js
class Foo {
  triggerRender() { console.log('trigger!'); }
}

setAside.afterSet(Foo.prototype, 'data', function() { this.triggerRender(); });
```
