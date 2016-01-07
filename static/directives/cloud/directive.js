var db = 'https://blistering-fire-6579.firebaseio.com/';

squarefabricApp.factory('Projects', ['$firebaseArray',
  function($firebaseArray) {
    return function(user, password) {
      var ref = new Firebase(db + 'squarefabric/projects/' + user + '/' + password);
      return $firebaseArray(ref);
    };
  }
]);


angular.module('squarefabricApp').directive('sfcloud', function(Projects) {
    return {
        templateUrl: 'static/directives/cloud/template.html',
        link : function (scope, element, attrs) {
            scope.checkUserInputs = function () {
                if (scope.uploadUser && scope.uploadPassword) {
                    return true;
                } else {
                    scope.showUserMessage('User information error', 'warning');
                }
            };

            scope.uploadProjects = function () {

                if(scope.checkUserInputs()) {
                    if(scope.projects.length) {
                        var fireprojects = Projects(scope.uploadUser, scope.uploadPassword);

                        //clear remote data
                        fireprojects.forEach(function (project) {
                            fireprojects.$remove(project);
                        });

                        var length = scope.projects.length;
                        //add local data to remote
                        for(var i=0; i<length; i++) {
                            fireprojects.$add(scope.projects[i]);
                        }
                       scope.showUserMessage('Upload complete', 'success');
                    } else {
                        scope.showUserMessage('Nothing to upload', 'warning');
                    }
                }
            };

            scope.downloadProjects = function () {
                if(scope.checkUserInputs()) {
                    var fireprojects = Projects(scope.uploadUser, scope.uploadPassword);

                    //clear local data
                    scope.projects = [];

                    //add remote data to local content
                    fireprojects.$loaded(function (data) {
                        data.forEach(function (project) {
                            scope.projects.push(project);
                        });
                    });
                    scope.showUserMessage('Download complete', 'success');

                }
            };

        }
    }
});