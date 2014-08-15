'use strict';

angular.module('emmiManager')

    .factory('focus', function ($rootScope, $timeout) {
        return function (name) {
            $timeout(function () {
                $rootScope.$broadcast('focusOn', name);
            });
        };
    })

    .directive('focusOn', function ($timeout) {
        return function (scope, elem, attr) {
            scope.$on('focusOn', function (e, name) {
                if (name === attr.focusOn) {
                    $timeout(function(){
                        elem[0].focus();
                    }, 0);
                }
            });
        };
    })

    .directive('autoFocus', function($timeout) {
        return {
            restrict: 'AC',
            link: function(_scope, _element) {
                $timeout(function(){
                    _element[0].focus();
                }, 250);
            }
        };
    })
;