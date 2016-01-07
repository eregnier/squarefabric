angular.module('squarefabricApp').directive('sfpieceslist', function() {
    return {
        templateUrl: 'static/directives/pieceslist/template.html',
        link : function (scope, element, attrs) {


            var sort= {

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
            };


            scope.getMaxHeight = function (pieces) {
                var maxH = 0;
                for (var i=0; i<pieces.length; i++) {
                    var p = pieces[i];
                    var max = p.fit.y + p.h;
                    if (max > maxH) {
                        maxH = max;
                    }
                }
                return maxH;
            };


            scope.optimize = function (pieces, laize) {

                var packer = new Packer(laize, 1000);

                pieces.sort(sort['height']);
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
                scope.$broadcast('setMaxHeight', maxH);

            };

		    scope.removePiece = function (index) {
		        scope.$parent.currentProject.pieces.splice(index, 1);
		    };

		    scope.updatePiece = function (piece) {
		        scope.editmode = true;
		        scope.currentPiece = piece;
		    };

		    scope.setPiece = function () {

		        var validSizeNumber = function (number) {
		           return number > 0 && !isNaN(number);
		        };

		        if (scope.editmode) {
		            scope.currentPiece = {};
		            scope.editmode = false;
		        } else {
		            if (validSizeNumber(scope.currentPiece.h) &&
		                validSizeNumber(scope.currentPiece.w) &&
		                validSizeNumber(scope.pamount)) {
		                for (var i=0; i<parseInt(scope.pamount); i++) {
		                    var newPiece = {
		                        w: scope.currentPiece.w,
		                        h: scope.currentPiece.h,
		                        name: scope.currentPiece.name + i
		                    };
		                    scope.$parent.currentProject.pieces.push(newPiece);
		                }
		                scope.currentPiece = {};
		                scope.pamount = 1;
		            } else {
		                scope.showUserMessage('Invalid number given', message.warning);
		            }
		            scope.optimize(scope.$parent.currentProject.pieces, scope.$parent.laize);
		        }

		    };
        }
    }
});