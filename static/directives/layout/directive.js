angular.module('squarefabricApp').directive('sflayout', function(optimize) {
    return {
        templateUrl: 'static/directives/layout/template.html',
        link : function (scope, element, attrs) {
            scope.rectangles = [];


            var repaint = function(blocks, s, height) {
                var block,
                    coeff = scope.coefficient,
                    colors = [ "#FFF7A5", "#FFA5E0", "#A5B3FF", "#BFFFA5", "#FFCBA5" ];

                s.rect(0, 0, scope.$parent.currentProject.laize  * coeff, height  * coeff).attr({
                    stroke: '#AAA',
                    fill: '#EEEEDD'
                });

                for (var n = 0 ; n < blocks.length ; n++) {
                    block = blocks[n];
                    if (block.fit) {
                    var rectangle = s.rect(
                        block.fit.x * coeff,
                        block.fit.y * coeff,
                        block.w * coeff,
                        block.h * coeff
                    );
                    rectangle.attr({
                        fill: colors[n % colors.length],
                        stroke: '#555'
                    });

                    var text = block.name + '\nH : ' + block.h + '\nL : ' + block.w;
                    s.text(block.fit.x  * coeff + 3, (block.fit.y + block.h / 2) * coeff - 15, text).attr({
                        fill: '#555'
                    });

                    }
                }
            };

            scope.$on('setMaxHeight', function (e, height) {
                var s = Snap($('body').width(), height * scope.coefficient);
                repaint(scope.$parent.currentProject.pieces, s, height);
            });

            var laize = scope.$parent.currentProject.laize;
            scope.coefficient = $('body').width() / laize;

            var packer = new Packer(laize, 100000);
            optimize.optimize(scope.$parent.currentProject.pieces, laize);



        }

    };
});