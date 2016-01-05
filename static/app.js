var squarefabricApp = angular.module('squarefabricApp', ['firebase']);

var DEBUG = true;

squarefabricApp.controller('SquarefabricCtrl', function ($scope) {

    $scope.version = '2.1';
    $scope.debug = DEBUG;

    $scope.maxHeight = 0;
    $scope.currentPiece = {};
    $scope.projects = [];
    $scope.editmode = false;
    $scope.pamount = 1;

    $scope.panels = {
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


    $scope._ = function (word) {
        var translation = i18n[$scope.language][word];
        if (translation) {
            return translation;
        } else {
            i18ntodo[word] = '';
            return word;
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
                $scope.panels['settings'] = true;
            } else {
                $scope.$broadcast('showUserMessage', 'No project selected', 'info');
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



    $scope.toggleLanguage = function (language) {
        localStorage.setItem('language', language);
        window.location = 'index.html';
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

    };

    $scope.init();

});