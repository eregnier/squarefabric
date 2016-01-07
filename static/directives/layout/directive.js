angular.module('squarefabricApp').directive('sflayout', function() {
    return {
        templateUrl: 'static/directives/layout/template.html',
        link : function (scope, element, attrs) {

            scope.rectangles = [];


            scope.drawRectangle = function(blocks, coeff) {
                var n, block,
                    colors = [ "#FFF7A5", "#FFA5E0", "#A5B3FF", "#BFFFA5", "#FFCBA5" ];
                for (n = 0 ; n < blocks.length ; n++) {
                    block = blocks[n];
                    if (block.fit) {
                        var path = paper.Path.Rectangle(
                            new paper.Rectangle(
                                block.fit.x * coeff,
                                block.fit.y * coeff,
                                block.fit.w * coeff,
                                block.fit.h * coeff
                            )
                        );
                        path.strokeColor = '#555555';
                        path.fillColor = colors[n % colors.length];
                        scope.rectangles.push(path);
                    }
                }
                paper.view.draw();
            };


            scope.repaint = function (blocks, packer) {
                //reset
                scope.drawRectangle(blocks, scope.coefficient);
                /*
                var fit = 0,
                    nofit = [],
                    block;

                for (var i=0, j=blocks.length; i<j; i++) {
                    block = blocks[n];
                    if (block.fit) {
                        fit = fit + block.area;
                    } else {
                        nofit.push("" + block.w + "x" + block.h);
                    }
                }
                */

            };


            var canvas = element.find('canvas');
            scope.coefficient = canvas.width() / 100.0;
            paper.setup(canvas[0]);

            var packer = new Packer(scope.$parent.laize, 1000);
            scope.repaint(scope.$parent.currentProject.pieces, packer);
        }

    }
});