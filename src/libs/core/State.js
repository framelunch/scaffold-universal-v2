const Cp = require('./Cp');
const { addToLoop, removeFromLoop } = require('../utils/loop');

function _set(prefix, items, pool, cps, arg) {
  for (let i = 0, l = items.length, name; i < l; i += 1) {
    name = items[i];
    pool.push({ prefix, name, arg });
    name = prefix + name;
    if (!cps[name]) {
      cps[name] = Cp();
    }
  }
}

class Data {
  constructor(value) {
    this.data = this.make(value);
    this.str = `/${this.data}`;
    this.array = (this.data === '') ? [''] : this.data.split('/');
  }
  make (value) {
    if (value.charAt(0) === '/') {
      value = value.substr(1);
    }
    if (value.charAt(value.length - 1) === '/') {
      value = value.substr(0, value.length - 1);
    }
    return value;
  }
  compare (value) {
    const
      arr = [],
      l = this.array.length;
    let
      i,
      a,
      b;

    for (i = 0; i < l; i += 1) {
      a = this.array.slice(0, i).join('/');
      b = value.array.slice(0, i).join('/');

      if (a + this.array[i] !== b + value.array[i]) {
        arr.push(this.array[i]);
      }
    }
    return arr;
  }
  eq (value) {
    return this.data === this.make(value);
  }
}
class State {
  constructor(def) {
    this.pool = [];
    this.active = false;
    this.w = 0;
    this.current = new Data(def || '');
    this.cps = { 'state:start': Cp(), 'state:update': Cp(), 'state:end': Cp() };

    const _this = this;
    this.loop = function () { _this._loop(); };

    this.isHistory = false;
    this.historys = [];
    this.ite = 0;
  }
  _loop() {
    if (this.w) { return; }

    if (this.pool.length === 0) {
      this.active = false;
      this.cps['state:end'].update();
      removeFromLoop(this.loop);
      return;
    }

    const o = this.pool[0];
    this.cps[o.prefix + o.name].update(o.arg);
    this.pool.shift();
  }
  _change(v, arg) {
    if (this.current.eq(v)) { return false; }
    const data = new Data(v);
    _set('remove:', this.current.compare(data).reverse(), this.pool, this.cps, arg);
    _set('add:', data.compare(this.current), this.pool, this.cps, arg);

    this.current = data;

    if (!this.active) {
      this.active = true;
      this.cps['state:start'].update();
      addToLoop(this.loop);
    }

    this.cps['state:update'].update([this.current]);
    return true;
  }
  change (v, arg) {
    if (this._change(v, arg)) {
      if (this.isHistory) {
        if (this.historys.length === 0) {
          this.historys.push(this.current.data);
        } else {
          this.historys.splice(this.ite + 1);
          this.historys.push(this.current.data);
          this.ite += 1;
        }
      }
      return true;
    }
    return false;
  }
  prev () {
    if (!this.isHistory) return;
    if (this.ite < 1) return;
    this.ite -= 1;
    this._change(this.historys[this.ite]);
  }
  next () {
    if (!this.isHistory) return;

    const l = this.historys.length;
    if (l === 0 || this.ite === l - 1) return;
    this.ite += 1;
    this._change(this.historys[this.ite]);
  }

  wait () {
    this.w += 1;
  }
  notify () {
    if (this.w > 0) this.w -= 1;
  }

  listen (key, func) {
    let c = this.cps[key];
    if (!c) {
      c = this.cps[key] = Cp();
    }
    c.add(func);
    return func;
  }
  clear (key, func) {
    const c = this.cps[key];
    if (!c) { return; }
    c.remove(func);
  }
}

module.exports = (def) => new State(def);
