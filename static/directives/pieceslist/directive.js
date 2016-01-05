angular.module('squarefabricApp').directive('sfpieceslist', function() {
    return {
        templateUrl: 'static/directives/pieceslist/template.html',
        link : function (scope, element, attrs) {

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
		            scope.optimize();
		        }

		    };
        }
    }
});