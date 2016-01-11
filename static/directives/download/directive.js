angular.module('squarefabricApp').directive('sfdownload', function($compileProvider) {
  return {
    templateUrl: 'static/directives/download/template.html',
    link : function (scope, element, attrs) {
        scope.download = function () {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data:text):/);
            var payload = {
                source: 'squarefabric',
                version: '3.0',
                projects: scope.$parent.projects
            }
            scope.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload));
            scope.download = 'SquareFabricProjects_' + + new Date() + '.json';
            console.log(scope.href);
        };
    }
  };
});