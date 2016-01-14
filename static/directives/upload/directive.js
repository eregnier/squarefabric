angular.module('squarefabricApp').directive('sfupload', function(fileReader, $timeout) {
  return {
    templateUrl: 'static/directives/upload/template.html',
    link : function (scope, element, attrs) {

        var uploadInput = element.find('#upload');

        scope.upload = function () {
            console.log('triggering upload');
            uploadInput.trigger('click');
        };

        uploadInput.change(function(e) {
            console.log('upload input change');
            scope.loading = true;
            scope.file = (e.srcElement || e.target).files[0];
            scope.filename = scope.file.name;
            fileReader.readAsText(scope.file, scope).then(
                function(result) {
                    scope.onFileReady(result);
                }
            );
        });


        scope.onFileReady = function (fileContent) {

            console.log('file load complete');
            var payload = JSON.parse(fileContent);
            scope.$parent.projects = payload.projects;
            scope.loading = false;
            scope.uploadComplete = true;
            $timeout(function () {
                scope.uploadComplete = false;
            }, 2000);
        };

    }
  };
});