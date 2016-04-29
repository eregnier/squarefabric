var db = 'https://blistering-fire-6579.firebaseio.com/';

angular.module('squarefabricApp').directive('sfcloud', function($firebaseObject, $rootScope) {
    return {
        templateUrl: 'static/directives/cloud/template.html',
        link : function (scope, element, attrs) {

            scope.getRef = function () {
                return new Firebase(db + 'squarefabric/projects/' + scope.uploadUser + '/' + scope.uploadPassword);
            };

            scope.credentials = function () {
                if(!scope.uploadUser || !scope.uploadPassword) {
                    $rootScope.$broadcast('showUserMessage', 'Missing user and/or passkey', 'warning');
                    return false;
                } else {
                    return true;
                }
            };

            scope.uploadProjects = function () {
                if (scope.credentials() && scope.$parent.projects) {
                    var ref = scope.getRef();
                    ref.set(angular.toJson({
                        projects: serializeProjects(scope.$parent.projects)
                    }));
                    $rootScope.$broadcast('showUserMessage', 'Projects saved on the cloud', 'info');
                }
            };

            scope.downloadProjects = function () {
                if (scope.credentials()) {
                    scope.getRef().on('value', function(snapshot) {
                        var value = JSON.parse(snapshot.val());
                        scope.$parent.projects = value.projects;
                        $rootScope.$broadcast('showUserMessage', 'Projects loaded from the cloud', 'info');
                    });
                }

            };

        }
    }
});