'use strict';

const _opt = require('./normal');

module.exports = function(col, key, opt) {
  opt = opt || _opt;
  const obj = {};
  let
    p,
    item,
    tar;
  for (p in col) {
    if (Object.prototype.hasOwnProperty.call(col, p)) {
      item = col[p];
      p = opt(item[key]);
      tar = obj[p] = obj[p] || [];
      tar.push(item);
    }
  }
  return obj;
};
