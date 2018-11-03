module.exports = {
  getQuestion(cat, diff, type) {
    let url = "https://opentdb.com/api.php?amount=1";
    if(cat && cat <= 32 && cat >= 9)
      url += "&category=" + ~~ cat;
    if(["easy", "medium", "hard", 0, 1, 2].includes(diff))
      url += "&difficulty=" + ((typeof diff === "string" && diff) || ["easy", "medium", "hard"][diff]);
    if(["multiple", "boolean", 0, 1].includes(type))
      url += "&type=" + ((typeof type === "string" && type) || ["multiple", "boolean"][type]);
    return require("./functions.js").parseURL(url);
  },
  parseQuestion(obj) {
    return (obj.question = decodeURIComponent(obj.question), obj.incorrect_answers = obj.incorrect_answers.map(q => decodeURIComponent(q)), obj.correct_answer = decodeURIComponent(obj.correct_answer), obj);
  }
};
