const cp = require('../core/Cp')();
const looptime = require('./looptime');

let id;

exports.addToLoop = function(func) {
  cp.add(func);
  if (!id) {
    id = setInterval(() => { cp.update(); }, looptime);
  }
  return func;
};

exports.removeFromLoop = function (func) {
  cp.remove(func);
  if (!cp.length) {
    clearInterval(id);
    id = null;
  }
};
