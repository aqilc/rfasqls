module.exports = {
  getQuestion(cat, diff, type) {
    let url = "https://opentdb.com/api.php?amount=1";
    if(cat && cat <= 32 && cat >= 9)
      url += "&category=" + ~~ cat;
    if([0, 1, 2].includes(diff))
      url += "&difficulty=" + ["easy", "medium", "hard"][diff];
    if([0, 1].includes(type))
      url += "&type=" + ["multiple", "boolean"][type];
    return require("./functions.js").parseURL(url);
  },
};
