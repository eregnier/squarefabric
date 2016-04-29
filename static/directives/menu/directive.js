angular.module('squarefabricApp').directive('sfmenu', function($rootScope) {
    return {
        templateUrl: 'static/directives/menu/template.html',
        link : function (scope, element, attrs) {

            scope.saveWorkingSpace = function() {
                localStorage.setItem('projects', angular.toJson(serializeProjects(scope.projects)));
                console.log('saved');
                $rootScope.$broadcast('showUserMessage', scope._('Projects local save complete.'), 'info');
            };


            scope.loadWorkingSpace = function() {
                try {
                    var projects = JSON.parse(localStorage.getItem('projects'));
                    if (projects) {
                        scope.projects = projects;
                    }
                } catch (err) {
                    scope.showUserMessage(scope._('Unable to load previous work, sorry'), 'danger');
                }
            };

            scope.loadWorkingSpace();

        }
    }
});