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
    $scope.pieces = [];
    $scope.currentPiece = {};
    $scope.editmode = false;
    $scope.panels = {
        piece: false,
        list: true,
        layout: false,
        settings: true,
        info: true,
        about: false,
    };
    $scope.userMessage = '';
    $scope.userAlertType = 'alert-success';
    $scope.laize = 150;

    $scope.mock = function(){
        $scope.pieces = [];
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
        $scope.panels['about'] = false;
        $scope.panels[panelName] = !$scope.panels[panelName];
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
        $scope.pieces = [];
        $scope.currentPiece = {};
        $scope.optimize();
        $scope.panels.layout = false;
        $scope.hoveritem = {};
        $('.rectangleHover').hide();
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

    $scope.removePiece = function (index) {
        $scope.pieces.splice(index, 1);
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
                $scope.pieces.push($scope.currentPiece);
                $scope.currentPiece = {};
            } else {
                $scope.showUserMessage('Invalid number given', message.warning);
            }
        }

    };

    $scope.optimize = function () {
        Pm.run($scope.pieces, $scope.laize);
        $scope.panels.layout = true;
    };

    $scope.init = function () {

        var language = localStorage.getItem('language');
        if (!language) {
            language = 'en';
        }
        $scope.language = language;

        var hover = hover = $('.rectangleHover');

        $(document).ready(function () {
            console.log('init canvas mouse move');

            var canvas = $('#canvas');

            canvas.mousemove(function(e) {

                var cx = e.pageX,
                    cy = e.pageY,
                    pcs = $scope.pieces,
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
                        .css('height', pcs[i].h + 'px');

                    }
                }

            });

        });

    };

    $scope.init();

});