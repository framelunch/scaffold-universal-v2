function fn(obj) {
  let
    key,
    item;

  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      item = obj[key];
      switch (typeof item) {
        case 'object': {
          fn(item);
          break;
        }
        case 'string': {
          const arr = /\/(.+)\/(g|i|m|y)?$/.exec(item);
          if (arr) {
            obj[key] = new RegExp(arr[1], arr[2]);
          }
          break;
        }
        default: break;
      }
    }
    if ({}.hasOwnProperty.call(obj, key)) {
      item = obj[key];
      switch (typeof item) {
        case 'object': {
          fn(item);
          break;
        }
        case 'string': {
          const arr = /\/(.+)\/(g|i|m|y)?$/.exec(item);
          if (arr) {
            obj[key] = new RegExp(arr[1], arr[2]);
          }
          break;
        }
        default: break;
      }
    }
  }
  return obj;
}

module.exports = fn;
