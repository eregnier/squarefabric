angular.module('squarefabricApp').directive('sfdownload', function($timeout) {
  return {
    templateUrl: 'static/directives/download/template.html',
    link : function (scope, element, attrs) {
        scope.download = function () {

            var payload = {
                source: 'squarefabric',
                version: '4.0',
                projects: serializeProjects(scope.$parent.projects)
            };
            var blob = new Blob([ angular.toJson(payload) ], { "type" : "application/json" });
            window.URL = window.URL || window.webkitURL;
            scope.href = window.URL.createObjectURL(blob);

            scope.download = 'SquareFabricProjects_' + (+ new Date()) + '.json';
        };
    }
  };
});