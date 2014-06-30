'use strict';

angular.module('emmiManager')
    .controller('MainCtrl', function ($scope, $translate) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
        };
    });
