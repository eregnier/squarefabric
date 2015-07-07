
Pm = {

  init: function() {

    Pm.el = {
      canvas:   $('#canvas')[0],
      ratio:    $('#ratio'),
      nofit:    $('#nofit')
    };

    if (!Pm.el.canvas.getContext) // no support for canvas
      return false;

    Pm.el.draw = Pm.el.canvas.getContext("2d");

  },

  //---------------------------------------------------------------------------

  optimize: function(blocks, W, H) {

    var sort = 'height';

    var packer = new Packer(W, H);

    Pm.sort.now(blocks, sort);

    packer.fit(blocks);

    return packer;

  },

  repaint: function (blocks, packer, coefficient) {
    Pm.canvas.reset(packer.root.w * coefficient, packer.root.h * coefficient);
    Pm.canvas.blocks(blocks, coefficient);
    Pm.canvas.boundary(packer.root);
    Pm.report(blocks, packer.root.w, packer.root.h);
  },

  //---------------------------------------------------------------------------

  report: function(blocks, w, h) {
    var fit = 0, nofit = [], block, n, len = blocks.length;
    for (n = 0 ; n < len ; n++) {
      block = blocks[n];
      if (block.fit)
        fit = fit + block.area;
      else
        nofit.push("" + block.w + "x" + block.h);
    }
    Pm.el.ratio.text(Math.round(100 * fit / (w * h)));
    Pm.el.nofit.html("Did not fit (" + nofit.length + ") :<br>" + nofit.join(", ")).toggle(nofit.length > 0);
  },

  //---------------------------------------------------------------------------

  sort: {

    random  : function (a,b) { return Math.random() - 0.5; },
    w       : function (a,b) { return b.w - a.w; },
    h       : function (a,b) { return b.h - a.h; },
    a       : function (a,b) { return b.area - a.area; },
    max     : function (a,b) { return Math.max(b.w, b.h) - Math.max(a.w, a.h); },
    min     : function (a,b) { return Math.min(b.w, b.h) - Math.min(a.w, a.h); },

    height  : function (a,b) { return Pm.sort.msort(a, b, ['h', 'w']);               },
    width   : function (a,b) { return Pm.sort.msort(a, b, ['w', 'h']);               },
    area    : function (a,b) { return Pm.sort.msort(a, b, ['a', 'h', 'w']);          },
    maxside : function (a,b) { return Pm.sort.msort(a, b, ['max', 'min', 'h', 'w']); },

    msort: function(a, b, criteria) { /* sort by multiple criteria */
      var diff, n;
      for (n = 0 ; n < criteria.length ; n++) {
        diff = Pm.sort[criteria[n]](a,b);
        if (diff != 0)
          return diff;
      }
      return 0;
    },

    now: function(blocks, sort) {
      blocks.sort(Pm.sort[sort]);
    }
  },

  //---------------------------------------------------------------------------

  canvas: {

    reset: function(width, height) {
      Pm.el.canvas.width  = width  + 1; // add 1 because we draw boundaries offset by 0.5 in order to pixel align and get crisp boundaries
      Pm.el.canvas.height = height + 1; // (ditto)
      Pm.el.draw.clearRect(0, 0, Pm.el.canvas.width, Pm.el.canvas.height);
    },

    rect:  function(x, y, w, h, color, name) {
      Pm.el.draw.fillStyle = color;
      Pm.el.draw.fillRect(x + 0.5, y + 0.5, w, h);
      Pm.el.draw.fillStyle = '#999';
      Pm.el.draw.strokeRect(x + 0.5, y + 0.5, w, h);
      Pm.el.draw.strokeText(name, x + 3, y + (h/2) - 8);
      Pm.el.draw.strokeText(parseInt(w) + ' x ' + parseInt(y), x + 3, y + (h/2) + 8);
    },

    stroke: function(x, y, w, h) {
      //Pm.el.draw.strokeRect(x + 0.5, y + 0.5, w, h);
    },

    blocks: function(blocks, coefficient) {
      var n, block;
      for (n = 0 ; n < blocks.length ; n++) {
        block = blocks[n];
        if (block.fit) {
          Pm.canvas.rect(
            block.fit.x * coefficient,
            block.fit.y * coefficient,
            block.w * coefficient,
            block.h * coefficient,
            Pm.color(n),
            block.name
          );
        }
      }
    },

    boundary: function(node) {
      if (node) {
        Pm.canvas.stroke(
          node.x,
          node.y,
          node.w,
          node.h
        );
        Pm.canvas.boundary(node.down);
        Pm.canvas.boundary(node.right);
      }
    }
  },

  //---------------------------------------------------------------------------

  colors: {
    pastel:         [ "#FFF7A5", "#FFA5E0", "#A5B3FF", "#BFFFA5", "#FFCBA5" ],
    basic:          [ "silver", "gray", "red", "maroon", "yellow", "olive", "lime", "green", "aqua", "teal", "blue", "navy", "fuchsia", "purple" ],
    gray:           [ "#111", "#222", "#333", "#444", "#555", "#666", "#777", "#888", "#999", "#AAA", "#BBB", "#CCC", "#DDD", "#EEE" ],
    vintage:        [ "#EFD279", "#95CBE9", "#024769", "#AFD775", "#2C5700", "#DE9D7F", "#7F9DDE", "#00572C", "#75D7AF", "#694702", "#E9CB95", "#79D2EF" ],
    solarized:      [ "#b58900", "#cb4b16", "#dc322f", "#d33682", "#6c71c4", "#268bd2", "#2aa198", "#859900" ],
    none:           [ "transparent" ]
  },

  color: function(n) {
    var cols = Pm.colors['pastel'];
    return cols[n % cols.length];
  }

  //---------------------------------------------------------------------------

}

$(Pm.init);

