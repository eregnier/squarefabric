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
            console.log($(this).val());
            scope.file = (e.srcElement || e.target).files[0];
            scope.filename = scope.file.name;
            fileReader.readAsDataUrl(scope.file, scope).then(
                function(result) {
                    scope.onFileReady(result);
                }
            );
        });


        scope.onFileReady = function (fileContent) {

            console.log('file load complete');
            console.log(fileContent);
            /*
            fileAdapter.put(
                'image',
                {
                    'fileContent': fileContent,
                    'fileName': scope.filename,
                }
            ).success(
                function (data) {
                    if (data.success) {
                        scope.imageurl = '/thumb/' + data.data.filename;
                        scope.content = data.data.filename;
                    }
                    scope.loading = false;
                    scope.uploadComplete = true;
                    console.log('file upload complete');
                    $timeout(function () {
                        scope.uploadComplete = false;
                    }, 2000);
                }
            );
            */
        };

    }
  };
});