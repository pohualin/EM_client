'use strict';

angular.module('emmiManager')

    .factory('focus', function ($rootScope, $timeout) {
        return function (name) {
            $timeout(function () {
                $rootScope.$broadcast('focusOn', name);
            });
        };
    })

    .directive('focusOn', function () {
        return function (scope, elem, attr) {
            scope.$on('focusOn', function (e, name) {
                if (name === attr.focusOn) {
                    elem[0].focus();
                }
            });
        };
    });