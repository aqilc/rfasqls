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
      fn: fn
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
    let e = this.events.find(e => e.name === event);

    if(e)
      e.fn(...args);
    else return new Error("Event doesn't exist");

    // Returns the object
    return this;
  }
}
module.exports = Events;
