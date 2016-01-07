angular.module('squarefabricApp').directive('sflayout', function(optimize) {
    return {
        templateUrl: 'static/directives/layout/template.html',
        link : function (scope, element, attrs) {

            scope.rectangles = [];


            scope.repaint = function(blocks) {
                var block,
                    coeff = scope.coefficient,
                    colors = [ "#FFF7A5", "#FFA5E0", "#A5B3FF", "#BFFFA5", "#FFCBA5" ];

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
                            new paper.Point(block.fit.x * coeff + 3, (block.fit.y + 1)  * coeff + block.h / 2)
                        );
                        text.content = block.name;
                        text.fillColor = '#555555';

                        var text = new paper.PointText(
                            new paper.Point(block.fit.x * coeff + 3, (block.fit.y + block.h / 2) * coeff)
                        );
                        text.content = block.w + ' x ' + block.h + ' ';
                        text.fillColor = '#555555';


                    }
                }
                paper.view.draw();
            };

            var canvas = element.find('canvas');
            scope.coefficient = canvas.width() / scope.$parent.laize;
            paper.setup(canvas[0]);

            var packer = new Packer(scope.$parent.laize, 1000);
            scope.repaint(scope.$parent.currentProject.pieces);
            optimize..optimize(scope.$parent.currentProject.pieces, scope.$parent.laize);
        }

    }
});