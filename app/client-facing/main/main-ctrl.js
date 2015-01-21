'use strict';

angular.module('emmiManager')
    .controller('MainCtrl', function ($scope, $translate, $locale, tmhDynamicLocale) {
        $scope.today = new Date();
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
            tmhDynamicLocale.set(langKey);
        };
    })
;
