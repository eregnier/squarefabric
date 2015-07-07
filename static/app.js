var squarefabricApp = angular.module('squarefabricApp', ['firebase']);

var db = 'https://blistering-fire-6579.firebaseio.com/';

squarefabricApp.factory('Projects', ['$firebaseArray',
  function($firebaseArray) {
    return function(user, password) {
      var ref = new Firebase(db + 'squarefabric/projects/' + user + '/' + password);
      return $firebaseArray(ref);
    };
  }
]);

SHOW_MESSAGE_BOX_DELAY = 4500;
DEBUG = false;

var message = {
    valid : 'success',
    info : 'info',
    warning : 'warning',
    error : 'danger',

};

squarefabricApp.controller('SquarefabricCtrl', function ($scope, Projects) {

    $scope.version = '2.1';
    $scope.debug = true;

    $scope.maxHeight = 0;
    $scope.currentPiece = {};
    $scope.projects = [];
    $scope.editmode = false;
    $scope.pamount = 1;

    $scope.panels = {
        piece: false,
        list: false,
        layout: false,
        settings: false,
        info: false,
        about: false,
        project: true,
        cloud: false,
    };

    $scope.userMessage = '';
    $scope.userAlertType = 'alert-success';
    $scope.laize = 140;

    $scope.checkUserInputs = function () {
        if ($scope.uploadUser && $scope.uploadPassword) {
            return true;
        } else {
            $scope.showUserMessage('User information error', 'warning');
        }
    };

    $scope.uploadProjects = function () {

        if($scope.checkUserInputs()) {
            if($scope.projects.length) {
                var fireprojects = Projects($scope.uploadUser, $scope.uploadPassword);

                //clear remote data
                fireprojects.forEach(function (project) {
                    fireprojects.$remove(project);
                });

                var length = $scope.projects.length;
                //add local data to remote
                for(var i=0; i<length; i++) {
                    fireprojects.$add($scope.projects[i]);
                }
               $scope.showUserMessage('Upload complete', 'success');
            } else {
                $scope.showUserMessage('Nothing to upload', 'warning');
            }
        }
    };

    $scope.downloadProjects = function () {
        if($scope.checkUserInputs()) {
            var fireprojects = Projects($scope.uploadUser, $scope.uploadPassword);

            //clear local data
            $scope.projects = [];

            //add remote data to local content
            fireprojects.$loaded(function (data) {
                data.forEach(function (project) {
                    $scope.projects.push(project);
                });
            });
            $scope.showUserMessage('Download complete', 'success');

        }
    };

    $scope._ = function (word) {
        var translation = i18n[$scope.language][word];
        if (translation) {
            return translation;
        } else {
            i18ntodo[word] = '';
            return word;
        }
    };

    $scope.editProject = function (project) {
        $scope.currentProject = project;
    };
    $scope.newProject = function () {
        $scope.currentProject = {
            pieces: []
        };
        $scope.projects.push($scope.currentProject);
    };

    $scope.removeProject = function (index) {
        if(confirm($scope._('Remove project ?'))) {
            $scope.projects.splice(index, 1);
            $scope.currentProject = undefined;
        }
    };

    $scope.mock = function(){
        $scope.currentProject.pieces = [];
        $scope.editmode = false;
        var r = function () { return parseInt(Math.random()*45+5);};
        for (var i=0; i<50; i++) {
            $scope.currentPiece.h = r();
            $scope.currentPiece.w = r();
            $scope.currentPiece.name = r() + '';
            $scope.setPiece();
        }
    };


    $scope.showUserMessage = function (message, level) {
        console.log(message);

        $scope.userMessage = $scope._(message);
        $scope.userAlertType = 'alert-' + level;
        $('#alertbox').slideDown(500);

        setTimeout(function () {
            $('#alertbox').slideUp(500);
            $scope.userMessage = '';
        },SHOW_MESSAGE_BOX_DELAY);
    };

    $scope.isActivePanel = function (panelName) {
        return $scope.panels[panelName];
    };

    $scope.print = function () {
        window.print();
    };

    $scope.togglePanel = function (panelName) {
        if (panelName === 'layout') {
            $scope.allPanelsDisplay(false);
            $scope.panels['layout'] = true;
            if ($scope.panels['layout']) {
                $scope.optimize();
            }
        } else if (panelName === 'cloud') {
            $scope.allPanelsDisplay(false);
            $scope.panels['cloud'] = true;
        } else if (panelName === 'project') {
            $scope.allPanelsDisplay(false);
            $scope.panels['project'] = true;
        } else if(panelName === 'edition') {
            if ($scope.currentProject) {
                $scope.allPanelsDisplay(false);
                $scope.panels['piece'] = true;
                $scope.panels['settings'] = true;
                $scope.panels['list'] = true;
            } else {
                $scope.showUserMessage('No project selected', 'info');
            }
        }
        $scope.activePanel = panelName;
    };

    $scope.allPanelsDisplay = function (doDisplay) {
        for (var panel in $scope.panels) {
            $scope.panels[panel] = doDisplay;
        }
    };


    $scope.showAbout = function () {
        $scope.allPanelsDisplay(false);
        $scope.panels['about'] = true;
    };

    $scope.clear = function () {
        $scope.currentProject.pieces = [];
        $scope.currentPiece = {};
        $scope.optimize();
        $scope.hoveritem = {};
        $('.rectangleHover').hide();
    };


    $scope.removePiece = function (index) {
        $scope.currentProject.pieces.splice(index, 1);
    };

    $scope.updatePiece = function (piece) {
        $scope.editmode = true;
        $scope.currentPiece = piece;
    };

    $scope.toggleLanguage = function (language) {
        localStorage.setItem('language', language);
        window.location = 'index.html';
    };

    $scope.setPiece = function () {

        var validSizeNumber = function (number) {
           return number > 0 && !isNaN(number);
        };

        if ($scope.editmode) {
            $scope.currentPiece = {};
            $scope.editmode = false;
        } else {
            if (validSizeNumber($scope.currentPiece.h) &&
                validSizeNumber($scope.currentPiece.w) &&
                validSizeNumber($scope.pamount)) {
                for (var i=0; i<parseInt($scope.pamount); i++) {
                    var newPiece = {
                        w: $scope.currentPiece.w,
                        h: $scope.currentPiece.h,
                        name: $scope.currentPiece.name + i
                    };
                    $scope.currentProject.pieces.push(newPiece);
                }
                $scope.currentPiece = {};
                $scope.pamount = 1;
            } else {
                $scope.showUserMessage('Invalid number given', message.warning);
            }
            $scope.optimize();
        }

    };

    $scope.showLayout = function () {
        $scope.panels.layout = true;
        var layout = $('.layout');
        var position = layout.position();
        var x = window.innerWidth / 2 - position.left / 2;
        var y = 70;

        layout.css('left', x + 'px');
        layout.css('top', y + 'px');
    };

    $scope.optimize = function () {
        var packer = Pm.optimize($scope.currentProject.pieces, $scope.laize, 1000);

        $scope.maxHeight = 0;
        for (var i=0; i<$scope.currentProject.pieces.length; i++) {
            var p = $scope.currentProject.pieces[i];
            var max = p.fit.y + p.h;
            if (max > $scope.maxHeight) {
                $scope.maxHeight = max;
            }
        }
        packer.root.h = $scope.maxHeight;
        $('#canvas').width(packer.root.w * $scope.coefficient);
        Pm.repaint($scope.currentProject.pieces, packer, $scope.coefficient);

        $scope.showLayout();
    };

    $scope.saveWorkingSpace = function() {
        var projects = JSON.stringify($scope.projects);
        localStorage.setItem('projects', projects);
    };


    $scope.loadWorkingSpace = function() {
        try {
            var projects = JSON.parse(localStorage.getItem('projects'));
            if (projects) {
                $scope.projects = projects;
            }
        } catch (err) {
            $scope.showUserMessage('Unable to load previous work, sorry', 'danger');
        }
    };

    $scope.getCoefficient = function () {
        var coefficient = window.innerWidth / $('#canvas').width();
        console.log('coefficient', coefficient);
        return coefficient;
    };

    $scope.coefficient = $scope.getCoefficient();

    $scope.init = function () {

        var language = localStorage.getItem('language');
        if (!language) {
            language = 'en';
        }
        $scope.language = language;

        $scope.showUserMessage(
            'Tip: save often your work with the save button in the top bar.',
            'info'
        );

        var hover = $('.rectangleHover'),
            handle =$('.handle'),
            padding = parseInt($('.layout').css('padding').replace('px', ''));

        $scope.setDraggable(handle, handle);

        $('#canvas').mousemove(function(e) {

            var pcs = $scope.currentProject.pieces,
                x = e.offsetX,
                y = e.offsetY,
                ctop = $('#canvas').position().top;

            for(var i=0;i<pcs.length;i++) { // check whether:

                var fx = pcs[i].fit.x * $scope.coefficient,
                    fy = pcs[i].fit.y * $scope.coefficient,
                    pw = pcs[i].w * $scope.coefficient,
                    ph = pcs[i].h * $scope.coefficient;

                if(x > fx && x < fx + pw && y > fy && y < fy + ph) {

                    // Make information available to info panel
                    $scope.hoveritem = pcs[i];
                    $scope.$apply();

                    console.log('Rectangle ' + i, pcs[i]);
                    var nx = fx + padding;

                    hover.show()
                    .css('left', nx + 'px')
                    .css('top', (fy + ctop) + 'px')
                    .css('width', pw + 'px')
                    .css('height', ph + 'px');

                    break;
                 }

            }

        });
        $scope.loadWorkingSpace();
    };

    $scope.setDraggable = function (handle, dragElement) {
        handle.on('mousedown', function() {
            console.log('mousedown', $(this));
            dragElement.addClass('draggable').parents().on('mousemove', function(e) {
                $('.draggable').offset({
                    top: e.pageY - 50,
                    left: e.pageX - $('.draggable').outerWidth() / 2
                }).on('mouseup', function() {
                    dragElement.removeClass('draggable');
                });
            });
        });
    };

    $scope.init();

});