angular.module('squarefabricApp').directive('sfproject', function() {
    return {
        templateUrl: 'static/directives/project/template.html',
        link : function (scope, element, attrs) {

            scope.editProject = function (project) {
                project.updatedate = + new Date();
                scope.$parent.currentProject = project;
            };
            scope.newProject = function () {
                scope.$parent.currentProject = {
                    pieces: [],
                    laize: 140,
                    createdate: +new Date()
                };
                scope.$parent.projects.push(scope.currentProject);
            };

            scope.removeProject = function (index) {
                if(confirm(scope._('Remove project ?'))) {
                    scope.$parent.projects.splice(index, 1);
                    scope.$parent.currentProject = undefined;
                }
            };

        }
    }
});