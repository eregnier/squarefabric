angular.module('squarefabricApp').service('optimize', function(usersAdapter, $location) {

    this.sort = {

        w       : function (a,b) { return b.w - a.w; },
        h       : function (a,b) { return b.h - a.h; },
        height  : function (a,b) { return sort.msort(a, b, ['h', 'w']);               },
        msort: function(a, b, criteria) {
          var diff;
          for (var i=0, j=criteria.length ; i<j; i++) {
            diff = sort[criteria[i]](a,b);
            if (diff != 0)
              return diff;
          }
          return 0;
        },
    },


    this.optimize = function (pieces, laize) {

        var packer = new Packer(laize, 1000);

        pieces.sort(this.sort['height']);
        packer.fit(pieces);

        var maxH = 0;
        for (var i=0; i<pieces.length; i++) {
            var p = pieces[i];
            var max = p.fit.y + p.h;
            if (max > maxH) {
                maxH = max;
            }
        }

        packer.root.h = maxH;
        scope.$parent.$broadcast('setMaxHeight', maxH);

    },


});