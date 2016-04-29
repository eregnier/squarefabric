angular.module('squarefabricApp').directive('usermessage', function() {
    return {
        templateUrl: 'static/directives/usermessage/template.html',
        link : function (scope, element, attrs) {
            var SHOW_MESSAGE_BOX_DELAY = 2500;
            scope.userMessage = '';
            scope.userAlertType = 'alert-success';

            scope.showUserMessage = function (message, level) {
                console.log(message);

                scope.userMessage = scope._(message);
                scope.userAlertType = 'alert-' + level;
                $('#alertbox').stop().slideDown(500);

                setTimeout(function () {
                    console.log(('#alertbox'));
                    $('#alertbox').stop().slideUp(500);
                    scope.userMessage = '';
                },SHOW_MESSAGE_BOX_DELAY);
            };

            scope.$on('showUserMessage', function (event, message, level) {
                scope.showUserMessage(message, level);
            });

            scope.showUserMessage(
                'Tip: save often your work with the save button in the top bar.', 'info'
            );

        }
    }
});