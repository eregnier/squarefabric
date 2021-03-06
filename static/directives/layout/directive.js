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

            var computeDisplay = function () {
                generateSnap();

                scope.$on('setMaxHeight', function (e, height) {
                    scope.height = height;
                    generateSnap();
                });

                var laize = scope.$parent.currentProject.laize;
                scope.coefficient = $('body').width() / laize;

                var packer = new Packer(laize, 100000);
                optimize.optimize(scope.$parent.currentProject.pieces, laize);
                computeEfficiency();
            };

            var computeEfficiency = function () {
                var totalSurface = scope.$parent.currentProject.laize * scope.height;
                console.log(scope.$parent.currentProject.pieces);
                var pieces = scope.$parent.currentProject.pieces;
                var usedSurface = 0;
                for (var i=0, j=pieces.length; i<j; i++) {
                    usedSurface += pieces[i].h * pieces[i].w;
                }
                scope.efficiency = usedSurface / totalSurface * 100;
            };


            var generateSnap = function () {
                if(scope.height !== undefined) {
                    var s = Snap($('body').width(), scope.height * scope.coefficient);
                    repaint(scope.$parent.currentProject.pieces, s, scope.height);
                }
            };
            computeDisplay();

            scope.$on('$destroy', function () {
                console.log('bye');
                $('svg').remove();
            });
        }

    };
});