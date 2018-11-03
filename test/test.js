"use strict";
/* eslint-disable */

const expect = require("chai").expect;
const pack = require("../main.js");
const functions = require("../stuff/functions.js");
const events = require("../stuff/events.js");
const trivia = require("../stuff/trivia.js");
const canvas = require("../stuff/canvas.js");
const youtube = require("../stuff/youtube.js");
const sql = require("../stuff/sql.js");

describe("#rfasqls", function() {
  it("Should check if check works properly and if every value from functions is a function", function() {
    var result = functions.check(pack.functions, "function");
    expect(result).to.equal(true);
  })
  it("Should give me an object containing on and emit functions plus an array of events", function() {
    var result = functions.check(new events(), ["events"]);
    expect(result).to.equal(true);
  });
  it("Should give me an object containing a question, answers, and other crap", async function() {
    const question = await trivia.getQuestion();
    var result = question.response_code === 0 && functions.check(question.results[0] || {}, ["question", "correct_answer", "incorrect_answers", "type", "difficulty", "category"]);
    expect(result).to.equal(true);
  })
})
