var db = 'https://blistering-fire-6579.firebaseio.com/';

angular.module('squarefabricApp').directive('sfcloud', function($firebaseObject) {
    return {
        templateUrl: 'static/directives/cloud/template.html',
        link : function (scope, element, attrs) {

            scope.getRef = function () {
                return new Firebase(db + 'squarefabric/projects/' + scope.uploadUser + '/' + scope.uploadPassword);
            };

            scope.credentials = function () {
                if(!scope.uploadUser || !scope.uploadPassword) {
                    scope.$parent.$broadcast('showUserMessage', 'Missing user and passkey', 'warning');
                    return false;
                } else {
                    return true;
                }
            };

            scope.uploadProjects = function () {
                if (scope.credentials() && scope.$parent.projects) {
                    var ref = scope.getRef();
                    ref.set(JSON.stringify({
                        projects: scope.$parent.projects
                    }));
                    scope.$parent.$broadcast('showUserMessage', 'Project saved', 'info');
                }
            };

            scope.downloadProjects = function () {
                if (scope.credentials()) {
                    scope.getRef().on('value', function(snapshot) {
                        var value = JSON.parse(snapshot.val());
                        scope.$parent.projects = value.projects;
                        scope.$parent.$broadcast('showUserMessage', 'Project loaded', 'info');
                    });
                }

            };

        }
    }
});