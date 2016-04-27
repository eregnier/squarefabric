angular.module('squarefabricApp').directive('sfpieceslist', function(optimize) {
    return {
        templateUrl: 'static/directives/pieceslist/template.html',
        link : function (scope, element, attrs) {

           scope.mock = function(){
                scope.$parent.currentProject.pieces = [];
                scope.editmode = false;
                var r = function () { return parseInt(Math.random()*45+5);};
                for (var i=0; i<50; i++) {
                    scope.currentPiece.h = r();
                    scope.currentPiece.w = r();
                    scope.currentPiece.name = r() + '';
                    scope.setPiece();
                }
            };

            scope.removePiece = function (piece) {
                var index = scope.$parent.currentProject.pieces.indexOf(piece);
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
                                name: scope.currentPiece.name + ' ' +  (i + 1)
                            };
                            scope.$parent.currentProject.pieces.push(newPiece);
                        }
                        scope.currentPiece = {};
                        scope.pamount = 1;
                    } else {
                        scope.showUserMessage('Invalid number given', 'warning');
                    }
                    optimize.optimize(scope.$parent.currentProject.pieces, scope.$parent.currentProject.laize);
                }

            };

            optimize.optimize(scope.$parent.currentProject.pieces, scope.$parent.currentProject.laize);
        }
    }
});