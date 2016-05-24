'use strict';
// const hasWeakMap = false;
const hasWeakMap = typeof WeakMap !== 'undefined';

const map = hasWeakMap ? new WeakMap() : (function() {
  const {defineProperty} = Object;
  const key = '__setAsideData__';

  return {
    set(obj, value) {
      if (typeof obj !== 'object') {
        throw new Error('WeakMap keys must be objects');
      }
      defineProperty(obj, key, { value, writable: true });
      return value;
    },

    get(obj) {
      return obj[key];
    },

    has(obj) {
      return obj.hasOwnProperty(key);
    },
  };
}());

const sideStore = obj => {
  if (map.has(obj)) {
    return map.get(obj);
  }
  const priv = {};
  map.set(obj, priv);
  return priv;
};

const {defineProperty, getOwnPropertyDescriptor} = Object;

function getPropertyDescriptor(obj, key) {
  let desc;
  let item = obj;
  while (item && !(desc = getOwnPropertyDescriptor(item, key))) {
    item = item.__proto__;
  }
  return desc;
}

function sideSet(obj, key, {before, after} = {}) {
  const oldPropDescriptor = getPropertyDescriptor(obj, key);
  const oldGet = oldPropDescriptor && oldPropDescriptor.get;

  defineProperty(obj, key, {
    get: oldGet ? oldGet : function() { return sideStore(this)[key]; },
    set: function(value) {
      const priv = sideStore(this);
      const current = priv[key];
      if (before) {
        before.call(this, value, current, this);
      }
      if (oldPropDescriptor && oldPropDescriptor.set) {
        oldPropDescriptor.set.call(this, value);
      } else {
        priv[key] = value;
      }
      if (after) {
        after.call(this, value, current, this);
      }
      return value;
    },
    configurable: true,
  })
}

function beforeSet(obj, key, before) {
  sideSet(obj, key, {before});
}

function afterSet(obj, key, after) {
  sideSet(obj, key, {after});
}

module.exports = {
  sideStore, sideSet, beforeSet, afterSet,
};
