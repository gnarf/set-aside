const assert = require('assert');
const setAside = require('./index');

(function hasGet() {
  var obj = Object.defineProperty({}, 'attr', {
    get() {
      return this._attr;
    },
    set(newValue) {
      return this._attr = newValue;
    },
    configurable: true
  });

  obj.attr = 23;

  setAside.afterSet(obj, 'attr', function() {
    args = arguments;
  });

  assert.equal(obj.attr, 23);

  obj.attr = 45;

  assert.equal(args[0], 45);
  assert.equal(args[1], 23);
  assert.equal(obj.attr, 45);
}());
