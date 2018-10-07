// Gets the package that is the point of this whole thing
const sql = require("sqlite")

// The SQL class that supposedly contains every thing you could think of with sql
class SQL {

  /**
   * Constructor for the class
   * @param {string} file
   * @returns {Object}
   */
  constructor(file) {
    if(!file || !file.includes("./"))
      return new Error("You need to specify the correct file name for me to do my job");

    sql.open("../../" + (file.startsWith("../") ? "../" : "") + file.slice(2, file.length));

    this.run = sql.run;
    this.get = sql.get;
    this.all = sql.all;
    this.toString = sql.toString;

    return this;
  }

  create(table, values) {
    if(typeof table !== "string" || typeof values !== "object")
      return new TypeError("Please specify both the `table` and `values` parameter")

  }
}
module.exports = SQL;
