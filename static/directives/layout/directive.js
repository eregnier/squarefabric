angular.module('squarefabricApp').directive('sflayout', function(optimize) {
    return {
        templateUrl: 'static/directives/layout/template.html',
        link : function (scope, element, attrs) {

            scope.rectangles = [];


            scope.repaint = function(blocks) {
                var block,
                    coeff = scope.coefficient,
                    colors = [ "#FFF7A5", "#FFA5E0", "#A5B3FF", "#BFFFA5", "#FFCBA5" ];

                //window.$context = element.find('canvas')[0].getContext('2d');
                element.find('canvas').attr('height', scope.coefficient * scope.maxHeight);
                //element.find('canvas')[0].getContext('2d').innerHeight = scope.maxHeight;
                //element.find('canvas').height(scope.coefficient * scope.maxHeight);

                for (var n = 0 ; n < blocks.length ; n++) {
                    block = blocks[n];
                    if (block.fit) {
                        var rectangle = new paper.Rectangle(
                            block.fit.x * coeff,
                            block.fit.y * coeff,
                            block.w * coeff,
                            block.h * coeff
                        );
                        var path = paper.Path.Rectangle(rectangle);
                        path.strokeColor = '#555555';
                        path.fillColor = colors[n % colors.length];
                        scope.rectangles.push(path);

                        var text = new paper.PointText(
                            new paper.Point(block.fit.x * coeff + 3, (block.fit.y + block.h / 2) * coeff - 15)
                        );
                        text.content = block.name + '\nH : ' + block.h + '\nL : ' + block.w ;
                        text.fillColor = '#555555';


                    }
                }
                paper.view.draw();
            };

            var laize = scope.$parent.currentProject.laize,
                canvas = element.find('canvas');
            scope.coefficient = canvas.width() / laize;
            paper.setup(canvas[0]);

            var packer = new Packer(laize, 1000);
            optimize.optimize(scope.$parent.currentProject.pieces, laize);
            scope.repaint(scope.$parent.currentProject.pieces);
        }

    }
});