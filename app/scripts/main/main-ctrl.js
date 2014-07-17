'use strict';

angular.module('emmiManager')
    .controller('MainCtrl', function ($scope, $translate) {

        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
        };
    })
;
