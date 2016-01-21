angular.module('squarefabricApp').directive('sfmenu', function() {
    return {
        templateUrl: 'static/directives/menu/template.html',
        link : function (scope, element, attrs) {

            var SHOW_MESSAGE_BOX_DELAY = 2500;

            scope.saveWorkingSpace = function() {
                var projects = [];
                //filter empty projects
                for (var i=0, j=scope.projects.length; i<j; i++) {
                    var p = scope.projects[i];
                    if(p.name && p.description) {
                        p.updatedate = + new Date();
                        if (p.laize === undefined) {
                            p.laize = 140;
                        }
                        projects.push(p);
                    }
                }
                var projects = JSON.stringify(projects);
                localStorage.setItem('projects', projects);
            };


            scope.loadWorkingSpace = function() {
                try {
                    var projects = JSON.parse(localStorage.getItem('projects'));
                    if (projects) {
                        scope.projects = projects;
                    }
                } catch (err) {
                    scope.showUserMessage('Unable to load previous work, sorry', 'danger');
                }
            };

            scope.showUserMessage = function (message, level) {
                console.log(message);

                scope.userMessage = scope._(message);
                scope.userAlertType = 'alert-' + level;
                $('#alertbox').slideDown(500);

                setTimeout(function () {
                    $('#alertbox').slideUp(500);
                    scope.userMessage = '';
                },SHOW_MESSAGE_BOX_DELAY);
            };

            scope.$on('showUserMessage', function (event, message, level) {
                scope.showUserMessage(message, level);
            });

            scope.$broadcast(
                'showUserMessage',
                'Tip: save often your work with the save button in the top bar.',
                'info'
            );

            scope.loadWorkingSpace();

        }
    }
});