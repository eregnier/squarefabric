var squarefabricApp = angular.module('squarefabricApp', ['firebase']);

var DEBUG = true;

squarefabricApp.controller('SquarefabricCtrl', function ($scope) {

    $scope.version = '3.0';
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

    $scope.$on('setMaxHeight', function (e, height) {
        $scope.maxHeight = height;
    })

    $scope._ = function (word) {
        var translation = i18n[$scope.language][word];
        if (translation) {
            return translation;
        } else {
            i18ntodo[word] = '';
            return word;
        }
    };

    $scope.isActivePanel = function (panelName) {
        return $scope.panels[panelName];
    };

    $scope.print = function () {
        window.print();
    };

    $scope.togglePanel = function (panelName) {

        var openPanels = ['cloud', 'project'];

        if ($scope.currentProject || openPanels.indexOf(panelName) !== -1) {
            $scope.allPanelsDisplay(false);
            $scope.panels[panelName] = true;
        } else {
            $scope.$broadcast('showUserMessage', 'No project selected', 'info');
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