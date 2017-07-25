const Cp = require('./Cp');

class Note {
  constructor() {
    this.cps = {};
  }
  listen(key, func) {
    let c = this.cps[key];
    if (!c) {
      c = this.cps[key] = Cp();
    }
    c.add(func);
    return func;
  }
  clear(key, func) {
    const c = this.cps[key];
    if (!c) { return; }
    c.remove(func);
  }
  publish(key, obj) {
    const c = this.cps[key];
    if (!c) { return; }
    c.update(obj);
  }
  release() {
    Object.values(this.cps)
      .forEach(cp => cp.release);
    delete this.cps;
  }
}

module.exports = () => new Note();
