// Gets the package that is the point of this whole thing
const f = require("./functions.js");

// The SQL class that supposedly contains every thing you could think of with sql
class SQL {

  /**
   * Constructor for the class
   * @param {string} file
   * @returns {Object}
   */
  constructor(sql) {
    if(typeof sql !== "object")
      return new TypeError("Please input the `sqlite` package into the module after opening the file of database")
    this.sql = sql;
    this.driver = this.sql.driver;
    this.run = this.sql.run;
    this.get = this.sql.get;
    this.all = this.sql.all;
    this.each = this.sql.each;
    this.toString = this.sql.toString;
  }

  async create(table, values) {
    if(typeof table !== "string" || typeof values !== "object")
      return new TypeError("Please specify both the `table` and `values` parameter")

    let statement = "CREATE TABLE IF NOT EXISTS " + table + " (";
    for (let i in values) {
      if(typeof values[i] === "string")
        statement += i + " " + values[i] + ", ";
    }
    if(statement[statement.length - 1] === "(")
      return new TypeError("Please include STRING values in the 'values' parameter");

    await this.run(statement + ")");
    return this;
  }

  async insert(table, values) {
    if(typeof table !== "string" && typeof values !== "object")
      throw new TypeError("Please input the first parameter as a string and the second parameter as an object");

    let tbl = await this.sql.all("SELECT * FROM sqlite_master WHERE name = " + table);
    if(!tbl)
      throw new Error("Table doesn't exist");

    let columns = f.ssParse(tbl.sql);
    for (let i in values)
      if(!Object.keys(columns).includes(i))
        throw new Error("Values specified do not exist in the table specified");

    this.run(`INSERT INTO ${tbl.name} (${Object.keys(columns).join(", ")}) VALUES (${Object.values(columns).join(", ")})`)
  }
}
module.exports = SQL;
