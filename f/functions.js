// A module that helps getting data from websites
const https = require("https")

// Exports
module.exports = {

  /**
   * Simplifies and improves "Math.random()"
   * @param {number} min
   * @param {number} max
   * @param {boolean} round
   */
  random(min, max, round) {
    if(min && !max)
      min = 0, max = min
    return round ? Math.round(Math.random() * (max-min) + min) : Math.random() * (max-min) + min
  },

  /**
   * Creates "pages" for embeds
   * @param {Array} array
   * @param {number} num
   * @param {number} page
   * @param {Function(index, value)} func
   * @returns {Object}
   */
  page_maker(array, num = 10, page = 0, func) {
    if(func && typeof func === "function") {
      for(var i = 0; i < array.slice(page*num, page*num + num).length; i ++) {
        func(i + page*num, array.slice(page*num, page*num + num)[i])
      }
      return this
    }
    else
      return false
  },

  /**
   * Converts numbers or strings into more numbers and strings that somehow represent time
   * @param {number or string} time
   * @param {string} type
   * @returns {number, string or Object}
   */
  time(time, type) {
    if(type)
      type = type.toLowerCase()

    function gnfs(str, num) {
      if(num < 1)
        return false

      let ntg = num
      if(ntg > 3)
        ntg = 3

      let nstr = str.slice(num - ntg, num)
      if(nstr.length === 1)
        return !isNaN(Number(nstr)) ? Number(nstr) : false
      else if(nstr.length === 2) {
        if(!isNaN(Number(nstr)))
          return Number(nstr)
        return !isNaN(Number(nstr.slice(1))) ? Number(nstr.slice(1)) : false
      } else {
        for(let i = 0; i < nstr.length; i ++) {
          let strn = nstr.slice(i)
          if(!isNaN(Number(strn)))
            return Number(strn)
        }
        return false
      }
    }
    function dbldigit(num) {
      if(isNaN(Number(num)))
        return false

      return String(num).length === 1 ? "0" + num : String(num).slice(-2, String(num).length)
    }
    if(!time)
      return { gnfs, dbldigit }

    if(typeof time === "string") {
      if(time[0] === "P") {
        if(time.startsWith("PT")) {
          time = time.slice(2)
        } else
          time = time.slice(1)

        let str = time,
            dys = gnfs(str, str.indexOf("DT")),
            hrs = gnfs(str, str.indexOf("H")),
            mns = gnfs(str, str.indexOf("M")),
            scs = gnfs(str, str.indexOf("S"))
        time = 0

        if(dys)
          time += dys * 8.64e7
        if(hrs)
          time += hrs * 3.6e6
        if(mns)
          time += mns * 6e4
        if(scs)
          time += scs * 1e3

        if(type === "ms")
          return time
        if(type === "s")
          return Math.round(time / 1000)
      } else if(time.includes(":")) {
        time = time.split(":")
        switch(time.length) {
          case 2:
            time = (Number(time[0]) * 60 + Number(time[1])) * 1000
            break
          case 3:
            time = (Number(time[0]) * 3600 + Number(time[1]) * 60 + Number(time[2])) * 1000
            break
          default:
            return false
        }

        if(isNaN(time))
          return false
      } else if(!isNaN(Number(time)))
        time = Number(time)
    } else if(typeof time !== "number")
      return false

    let x = time
    let ms = Math.floor(x % 1000)
    x /= 1000
    let s = Math.floor(x % 60)
    x /= 60
    let m = Math.floor(x % 60)
    x /= 60
    let h = Math.floor(x % 24)
    x /= 24
    let d = Math.floor(x)

    if(typeof type === "string") {
      if(type === "s")
        return Math.round(time / 1000)
      if(type === "ms")
        return time

      let str = type

      str = str.replace(/hh/g, dbldigit(h))
      str = str.replace(/mm/g, dbldigit(m))
      str = str.replace(/ss/g, dbldigit(s))
      str = str.replace(/h/g, h)
      str = str.replace(/m/g, m)
      str = str.replace(/s/g, s)
      str = str.replace(/ms/g, ms)
      str = str.replace(/H/g, time / 3.6e6)
      str = str.replace(/M/g, time / 6e5)
      str = str.replace(/S/g, time / 1000)
      str = str.replace(/MS/g, time)

      if(str !== type)
        return str
    }

    //Shortens the time message by clearing unnecessary things
    let timeStuff = ""
    if (d > 0) {
      timeStuff += `${d} day${(d > 1 ? "s" : "") + ((h > 0 || m > 0 || s > 0) ? ", " : "")}, `
    } if (h > 0) {
      timeStuff += `${h} hour${(h > 1 ? "s" : "") + ((m > 0 || s > 0) ? ", " : "")}`
    } if (m > 0) {
      timeStuff += `${m} minute${(m > 1 ? "s" : "")  + (s > 0 ? ", " : "")}`
    } if (s > 0) {
      timeStuff += `${(d > 0 || h > 0 || m > 0) ? "and " : ""}${s} second${s > 1 ? "s" : ""}`
    } return timeStuff
  },

  /**
   * Converts inputted number into gb, mb, kb, or bute format
   * @param {number} bytes
   * @param {number} pre
   * @returns {string}
   */
  bytes(bytes, pre = 1) {
    if(bytes > 1000000000000)
      return `${(bytes/1000000000000).toFixed(1)} TB`
    if(bytes > 1000000000)
      return `${(bytes/1000000000).toFixed(pre)} GB`
    if(bytes > 1000000)
      return `${(bytes/1000000).toFixed(pre)} MB`
    else if(bytes > 1000)
      return `${(bytes/1000).toFixed(pre)} KB`
    else
      return `${bytes} bytes`
  },

  /**
   * Gets a value from an object with a string path
   * @param {object} obj
   * @param {string} str
   * @returns {value}
   */
  get_val(obj, str) {
    let v = obj; str = str.split(".");
    for(let i = 0; i < str.length; i ++) {
      if(v[str[i]])
        v = v[str[i]];
      else return undefined;
    }
    return v;
  },

  /**
   * Gets JSON from the requested url
   * @param {string} url
   * @returns {Promise}
   */
  parseURL(url) {
    return new Promise((resolve, reject) => {

      // Sends a request to recieve data from a specific url
      https.get(url, (res) => {

        // String thats going to hold the incoming data
        var data = ""

        // Collects and stores incoming data
        res.on("data", chunk => {
          data += chunk
        })

        // Parses the data and resolves the promise
        res.on("end", () => {
          try {
            var json = JSON.parse(data)
            resolve(json)
          } catch(error) {
            reject(error)
          }
        })

      }).on("error", (error) => {

        // Rejects if there are any errors
        reject(error)
      })
    })
  },

  /**
   * Capatilizes the first letters of every word in a string
   * @param {string} str
   * @return {string}
   */
  capFirst(str) {
    if(typeof str !== "string")
      return new Error("The first argument needs to be a string.")
    return str.split(" ").map(val => val.slice(0, 1).toUpperCase() + val.slice(1).toLowerCase()).join(" ")
  }
}
