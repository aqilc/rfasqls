// Youtube downloaders
const ytdl = require("ytdl-core");
//const youtubedl = require("youtube-dl");
const f = require("./functions.js")
const request = require("request");
const ytAk = require("./.data/config.js")["yt-token"];

// Youtube class that does shit
class YT {
  constructor(link, options) {
    return ytdl(link, options);
  }

  //static download(link, options, file, callback) {
  //}

  /**
   * Searches for a search through the YouTube API
   * @param {string} serach
   * @param {Object} info
   * @returns {Promise}
   */
  static search(search, info) {
    return new Promise(function (resolve, reject) {

      // Search for results
      request("https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=video&maxResults=50&q=" + encodeURIComponent(search) + "&key=" + ytAk, (error, response, body) => {
        var json = JSON.parse(body);

        // If it finds an error
        if("error" in json)
          reject([json.error.errors[0].msg, json.error.errors[0].reason], true);

        // If it didn't find any videos
        else if(json.items.length === 0)
          reject("No videos found using that criteria", false);

        // If all goes well...
        else {
          let vids = info && info.results > 1 ? json.items.splice(info.results).map(j => j.id.videoId) : json.items[0].id.videoId;

          if(!info || !info.info)
            resolve(vids);

          if(info && info.info)
            YT.info(vids, resolve);
        }
      });
    });
  }

  /**
   * Gets information on youtube link(s)
   * @param {string or Array} vids
   * @param {Function} callback
   * @param {boolean} type
   * @return {Object}
   */
  static info(vids, callback, type) {
    if(!type)
      return new Promise((res, rej) => {
        request("https://www.googleapis.com/youtube/v3/videos?part=id,snippet,contentDetails,statistics&id=" + (typeof vids === "string" ? vids : vids.join(",")) + "&key=" + this._ytAk, (error, response, body) => {
          let vals = [],
              info = JSON.parse(body),
              gv = f.get_val;
          if("error" in info)
            rej(new Error(res.status, body));
          for(let i = 0; i < info.items.length; i ++) {
            let obj = {}, val = info.items[i],
                items = {
                  publishedAt: "statistics.publishedAt",
                  view_count: "statistics.views", views: "statistics.views",
                  likes: "statistics.likeCount",
                  dislikes: "statistics.dislikeCount",
                  thumbnail: "snippet.thumbnail.high.url", thumbnail_url: "snippet.thumbnail.high.url",
                  id: "id", vid: "id", video_id: "id",
                  title: "snippet.title",
                  description: "snippet.description",
                  channel: "snippet.channelTitle",
                  channelId: "snippet.channelId",
                  duration: "contentDetails.duration", length_seconds: "contentDetails.duration", length: "contentDetails.duration",
                  tags: "snippet.tags",
                };
            for(let j in items) {
              obj[j] = gv(val, items[j]);
            }
            if(obj.duration && obj.length_seconds && obj.length)
              obj.duration = obj.length_seconds = obj.length = f.time(val.contentDetails.duration);
            vals.push(obj);
          }
          if(typeof callback === "function")
            callback(vals);
          res(vals);
        });
      });
    else
      return ytdl.getInfo("https://www.youtube.com/watch?v=" + vids);
  }
}
module.exports = YT;
