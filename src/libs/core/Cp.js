const dummy = { update() {} };
let count = 0;

class Node {
  constructor(fc, prev, next) {
    this.func = fc;
    this.prev = prev;
    this.next = next;
    this.available = false;
  }
  update(args) {
    this.func.apply(null, args || []);
    this.next.update(args);
  }
  reverse(args) {
    this.func.apply(null, args || []);
    this.prev.update(args);
  }
  release() {
    delete this.func;
    delete this.next;
    delete this.prev;
  }
}

class Cp {
  constructor() {
    count += 1;
    this.id = count;
    this.index = 1;
    this.length = 0;
    this.first = new Node(() => {}, dummy, dummy);
    this.current = this.first;
    this.list = {};
  }
  update(args) {
    this.first.update(args);
  }
  reverse(args) {
    this.current.reverse(args);
  }
  add(fc) {
    let n,
      id;

    id = fc[`__coupling__${this.id}`];
    if (id) {
      n = this.list[id];
      if (n.available) {
        return;
      }
      n.prev = this.current;
      n.next = dummy;
    } else {
      this.index += 1;
      id = fc[`__coupling__${this.id}`] = this.index;
      n = this.list[id] = new Node(fc, this.current, dummy);
    }

    n.available = true;
    this.current.next = n;
    this.current = n;

    this.length += 1;
    return fc;
  }
  remove(fc) {
    const id = fc[`__coupling__${this.id}`];
    if (!id) {
      return null;
    }

    const n = this.list[id];
    if (!n.available) { return; }

    n.prev.next = n.next;
    n.next.prev = n.prev;

    if (this.current === n) { this.current = n.prev; }
    n.available = false;

    this.length -= 1;
    return id;
  }
  dispose(fc) {
    const id = this.remove(fc);
    delete this.list[id];
    delete fc[`__coupling__${this.id}`];
  }
  release() {
    let
      n,
      p;
    const { list } = this;

    for (p in list) {
      if (Object.prototype.hasOwnProperty.call(list, p)) {
        n = list[p];
        delete n.fc[`__coupling__${this.id}`];
        n.release();
      }
    }
    delete this.id;
    delete this.index;
    delete this.length;
    delete this.first;
    delete this.current;
    delete this.list;
  }
}

module.exports = () => new Cp();
