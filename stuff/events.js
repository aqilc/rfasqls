class Events {
  /**
   * Constructor for everything
   * @returns {Object}
   */
  constructor() {
    this._events = [];
    return this;
  }

  /**
   * Creates an event
   * @param {string} event
   * @param {Function(...args)} fn
   * @param {Number} uses
   * @returns {Object}
   */
  on(event, fn, uses) {
    if(typeof fn !== "function")
      return new Error("You need to specify a function when specifying an event");
    this._events.push({
      name: event,
      fn: fn,
      called: 0,
      last_call: new Date().valueOf(),
      uses: Math.abs(uses) || Infinity
    });
    return this;
  }

  /**
   * Makes an event that only gets called once
   * @param {string} event
   * @param {Function(...args)} fn
   * @returns {Object}
   */
  once(event, fn) {
    if(typeof fn !== "function")
      return new Error("You need to specify a function when specifying an event");
    this._events.push({
      name: event,
      fn: fn,
      called: 0,
      last_call: new Date().valueOf(),
      uses: 1,
    });
    return this;
  }

  /**
   * Executes event
   * @param {string} event
   * @param {...} args
   * @returns {Object}
   */
  emit(event, ...args) {
    let e = this._events.filter(e => e.name === event);

    if(e !== [])
      if(e.length === 1 && e[0].uses)
        e[0].fn(...args), e[0].called ++, e[0].last_call = Date.now(), e[0].uses --;
      else
        for (var i = 0; i < e.length; i ++)
          if(e[i].uses)
            e[i].fn(...args), e[i].called ++, e[i].last_call = Date.now(), e[i].uses --;

    // Returns the object
    return this;
  }
}
module.exports = Events;
