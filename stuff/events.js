class Events {
  /**
   * Constructor for everything
   * @returns {Object}
   */
  constructor() {
    this.events = [];
    return this;
  }

  /**
   * Creates an event
   * @param {string} event
   * @param {Function(...args)} fn
   * @returns {Object}
   */
  on(event, fn) {
    if(typeof fn !== "function")
      return new Error("You need to specify a function when specifying an event");
    this.events.push({
      name: event,
      fn: fn,
      called: 0,
      last_call: new Date().valueOf(),
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
    let e = this.events.filter(e => e.name === event);

    if(e !== []) {
      if(e.length < 1)
        e[0].fn(...args), e[0].called ++, e[0].last_call = Date.now();
      else
        for (var i = 0; i < e.length; i ++)
          e[i].fn(...args), e[i].called ++, e[i].last_call = Date.now();
    }
    else return new Error("Event doesn't exist");

    // Returns the object
    return this;
  }
}
module.exports = Events;
