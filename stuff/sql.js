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

    this.sql = sql;
    this.run = sql.run;
    this.get = sql.get;
    this.all = sql.all;
    this.toString = sql.toString;

    return this;
  }

  create(table, values) {
    if(typeof table !== "string" || typeof values !== "object")
      return new TypeError("Please specify both the `table` and `values` parameter")

    let statement = "CREATE TABLE IF NOT EXISTS " + table + " (";
    for (let i in values) {
      if(typeof values[i] === "string")
        statement += i + " " + values[i] + ", ";
    }
    if(statement[statement.length - 1] === "(")
      return new TypeError("Please include STRING values in the 'values' parameter");

    this.run(statement + ")");
  }

  async insert(table, values) {
    if(typeof table !== "string" && typeof values !== "object")
      throw new TypeError("Please input the first parameter as a string and the second parameter as an object");

    let tbls = await this.sql.all("SELECT * FROM sqlite_master");
    if(!tbls.find(t => t.name === table))
      throw new Error("Table doesn't exist");

  }
}
module.exports = SQL;
