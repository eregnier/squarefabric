var squarefabricApp = angular.module('squarefabricApp', []);

var fabricTypes = {
    PLAIN: 'plain',
    PATTERN: 'pattern',

};

SHOW_MESSAGE_BOX_DELAY = 4500;
DEBUG = false;

var message = {
    valid : 'success',
    info : 'info',
    warning : 'warning',
    error : 'danger',

};

squarefabricApp.controller('SquarefabricCtrl', function ($scope) {
    $scope.version = '1.2';
    $scope.maxHeight;
    $scope.currentPiece = {};
    $scope.projects = [];
    $scope.editmode = false;

    $scope.panels = {
        piece: false,
        list: false,
        layout: false,
        settings: false,
        info: false,
        about: false,
        project: true,
    };

    $scope.userMessage = '';
    $scope.userAlertType = 'alert-success';
    $scope.laize = 140;

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

    $scope.togglePanel = function (panelName) {
        if (panelName === 'project' && !$scope.panels['project']) {
            $scope.allPanelsDisplay(false);
            $scope.panels['project'] = true;
        } else {
            if ($scope.currentProject) {
                $scope.panels['about'] = false;
                $scope.panels[panelName] = !$scope.panels[panelName];
                $scope.activePanel = panelName;
            } else {
                $scope.showUserMessage('No project selected', 'info');
            }
        }
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
        $scope.panels.layout = false;
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
    }

    $scope.setPiece = function () {

        var validSizeNumber = function (number) {
           return number > 0 && !isNaN(number);
        };

        if ($scope.editmode) {
            $scope.currentPiece = {};
            $scope.editmode = false;
        } else {
            if (validSizeNumber($scope.currentPiece.h) && validSizeNumber($scope.currentPiece.w)) {
                $scope.currentProject.pieces.push($scope.currentPiece);
                $scope.currentPiece = {};
            } else {
                $scope.showUserMessage('Invalid number given', message.warning);
            }
        }

    };

    $scope.optimize = function () {
        Pm.run($scope.currentProject.pieces, $scope.laize);
        $scope.panels.layout = true;
        $scope.maxHeight = 0;
        for (var i=0; i<$scope.currentProject.pieces.length; i++) {
            var p = $scope.currentProject.pieces[i];
            var max = p.fit.y + p.h;
            if (max > $scope.maxHeight) {
                $scope.maxHeight = max;
            }
        }
    };

    $scope.saveWorkingSpace = function() {
        var projects = JSON.stringify($scope.projects);
        console.log(projects);
        localStorage.setItem('projects', projects);
    };


    $scope.loadWorkingSpace = function() {
        try {
            $scope.projects = JSON.parse(localStorage.getItem('projects'));
        } catch (err) {
            $scope.showUserMessage('Unable to load previous work, sorry', 'danger');
        }
    };

    $scope.init = function () {

        var language = localStorage.getItem('language');
        if (!language) {
            language = 'en';
        }
        $scope.language = language;

        $scope.showUserMessage(
            'Tip: save often your work with the save button in the top bar.',
            'info'
        )

        var hover = hover = $('.rectangleHover');

        $(document).ready(function () {
            console.log('init canvas mouse move');

            var canvas = $('#canvas');

            canvas.mousemove(function(e) {

                var cx = e.pageX,
                    cy = e.pageY,
                    pcs = $scope.currentProject.pieces,
                    pl = parseInt($('.layout').css('padding-left').replace('px', '')),
                    pt = parseInt($('.layout').css('padding-top').replace('px', '')),
                    co = canvas.offset();


                var nx = cx - co.left,
                    ny = cy - co.top;

                for(var i=0;i<pcs.length;i++) { // check whether:
                    if(nx > pcs[i].fit.x            // mouse x between x and x + width
                    && nx < pcs[i].fit.x + pcs[i].w
                    && ny > pcs[i].fit.y            // mouse y between y and y + height
                    && ny < pcs[i].fit.y + pcs[i].h) {

                        // Make information available to info panel
                        $scope.hoveritem = pcs[i];
                        $scope.$apply();

                        console.log('Rectangle', i, nx, ny, pl, pt);

                        hover.show()
                        .css('left', (pcs[i].fit.x + pl) + 'px')
                        .css('top', (pcs[i].fit.y + pt) + 'px')
                        .css('width', pcs[i].w + 'px')
                        .css('height', pcs[i].h + 'px')
                        .html(pcs[i].name);

                    }
                }

            });

        });
        $scope.loadWorkingSpace();
    };

    $scope.init();

});