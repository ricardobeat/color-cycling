(function() {
  var ctx, get, getAll, ready, sourceImage, stage;

  get = function(s) {
    return document.querySelector(s);
  };

  getAll = function(s) {
    return document.querySelectorAll(s);
  };

  stage = get('#stage');

  ctx = stage.getContext('2d');

  sourceImage = new Image();

  sourceImage.onload = function() {
    return ready();
  };

  sourceImage.src = 'images/poa.png';

  ready = function() {
    var FPS, c, cdata, color, colors, colorsKeyed, currentFrame, draw, drawArea, frames, i, imageData, j, lastColor, ln, mapped, nframes, pixels, pos, rgb, smoothColors, _len, _ref;
    console.log('ready');
    stage.width = sourceImage.width;
    stage.height = sourceImage.height;
    ctx.drawImage(sourceImage, 0, 0);
    drawArea = {
      width: stage.width,
      height: stage.height - 371,
      x: 0,
      y: 371
    };
    imageData = ctx.getImageData(drawArea.x, drawArea.y, drawArea.width, drawArea.height);
    pixels = imageData.data;
    ln = pixels.length;
    mapped = {};
    colorsKeyed = {};
    colors = [];
    for (i = 0; i < ln; i += 4) {
      rgb = pixels[i] + ',' + pixels[i + 1] + ',' + pixels[i + 2];
      if (!colorsKeyed[rgb]) {
        j = colors.push(rgb.split(','));
        colorsKeyed[rgb] = j - 1;
      }
      mapped[i] = colorsKeyed[rgb];
    }
    for (i = 0, _len = colors.length; i < _len; i++) {
      color = colors[i];
      colors[i] = color.map(function(c) {
        return +c;
      });
    }
    smoothColors = function(times) {
      var color, i, key, next, pos, sourceColors, _i, _len2, _len3;
      for (_i = 0; 0 <= times ? _i < times : _i > times; 0 <= times ? _i++ : _i--) {
        sourceColors = colors.slice();
        colors = [];
        for (i = 0, _len2 = sourceColors.length; i < _len2; i++) {
          color = sourceColors[i];
          colors.push(color);
          if (next = sourceColors[i + 1]) {
            colors.push([Math.floor((color[0] + next[0]) / 2), Math.floor((color[1] + next[1]) / 2), Math.floor((color[2] + next[2]) / 2)]);
          }
        }
        colors.push([Math.floor((color[0] + colors[0][0]) / 2), Math.floor((color[1] + colors[0][1]) / 2), Math.floor((color[2] + colors[0][2]) / 2)]);
      }
      for (pos = 0, _len3 = mapped.length; pos < _len3; pos++) {
        key = mapped[pos];
        mapped[key] = pos * times % colors.length;
      }
      return null;
    };
    smoothColors(3);
    lastColor = colors.length;
    frames = [];
    for (i = 0, _ref = colors.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      c = ctx.createImageData(drawArea.width, drawArea.height);
      cdata = c.data;
      for (j = 0; j < ln; j += 4) {
        pos = (mapped[j] + i) % lastColor;
        color = colors[pos];
        cdata[j] = color[0];
        cdata[j + 1] = color[1];
        cdata[j + 2] = color[2];
        cdata[j + 3] = 255;
      }
      frames.push(c);
    }
    FPS = 30;
    currentFrame = 0;
    nframes = frames.length;
    draw = function() {
      ctx.putImageData(frames[currentFrame], drawArea.x, drawArea.y);
      currentFrame = (currentFrame + 1) % nframes;
      return null;
    };
    console.log("Starting animation");
    return setInterval(draw, 1000 / FPS);
  };

}).call(this);
