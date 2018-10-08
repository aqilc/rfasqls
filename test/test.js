"use strict";

/* eslint-disable */

const expect = require("chai").expect;
const pack = require("../main.js");

describe("#rfasqls", function() {
  it("should check if check works properly", function() {
    var result = pack.Functions.check(["hello", "jdsajdlask", 121212], "string");
    expect(result).to.equal(false);
  })
})
