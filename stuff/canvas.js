module.exports = {
  // Canvas functions
  round_rect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == 'undefined')
      stroke = true
    if (typeof radius === 'undefined')
      radius = 5
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius}
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0}
      for (let side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side]
      }
    }
    ctx.beginPath()
    ctx.moveTo(x + radius.tl, y)
    ctx.lineTo(x + width - radius.tr, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
    ctx.lineTo(x + width, y + height - radius.br)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
    ctx.lineTo(x + radius.bl, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
    ctx.lineTo(x, y + radius.tl)
    ctx.quadraticCurveTo(x, y, x + radius.tl, y)
    ctx.closePath()
    if (fill) {
      ctx.fill()
    }
    if (stroke) {
      ctx.stroke()
    }
  },

  /**
   * Makes a circle for the `canvas@next` module

   * @param {Object} ctx
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   */
  circle(ctx, x, y, radius) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI*2, true)
    ctx.closePath()
    ctx.fill()
  },
  autofont(msg, canvas, x, mX, size = 70, addons) {
    let ctx = canvas.getContext("2d")

    // Sizes the text size down to fit space
    do { ctx.font = `${addons.before || ""} ${size -= 1}px ${addons.after || "arial"}` } while(ctx.measureText(msg).width + x > mX)

    // Returns size
    return { font: ctx.font, size: size }
  },
  dist(obj1, obj2) {
    if(!this.check([obj1, obj2], ["x", "y"]))
      return 0;

    return Math.abs(Math.sqrt((obj1.x - obj2.x) ^ 2 + (obj1.y - obj2.y) ^ 2));
  },
  colliding(obj1, obj2, type) {
    if(!this.check([obj1, obj2], "object") && this.check([obj1, obj2], ["x", "y"]))
      return false;

    let r, c, m;
    switch(type) {
      case "r:c":
        r = obj1, c = obj2;
      case "c:r":
        if(!r && !c)
          r = obj2, c = obj1;

        if(!r.w || !r.h)
          return false;
        if(!(c.w && c.h) || !c.r)
          return false;

        if(c.r) {
          let cx = c.x - Math.max(r.x, Math.min(c.x, r.x + r.w)),
              cy = c.y - Math.max(r.y, Math.min(c.y, r.y + r.h));
          return (cx * cx + cy * cy) < (c.r * c.r)/4;
        } else if(c.w && c.h) {
          return false;
        } else
          return false;
      case "c:m":
        m = obj2, c = obj1;
      case "m:c":
        if(!m || !c)
          m = obj1, c = obj2;
        if(!c.r && !c.h && !c.w)
          return false;
        else {
          let w, h;
          if(c.r)
            w = c.r, h = c.h;
          else if(c.h || c.w)
            w = c.w || c.h, h = c.h || c.w;
          else
            return false;

          if(this.dist(m.x || 0, m.y || 0, w, h))
            return true;
        }
        break;
    }
  },
}
