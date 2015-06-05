'use strict';
angular.module('emmiManager')
/**
 * Small directive to allow CSS hooks for non-empty fields. (EM-1371)
 * ngValid was not enough due to how optional fields work in Angular.
 */
    .directive('inputIcon', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elm) {
                scope.$watch(function () {
                    return elm.val();
                }, function (newVal) {
                    if (newVal !== undefined && newVal.length) {
                        elm.addClass('not-empty');
                    } else {
                        elm.removeClass('not-empty');
                    }
                });
            }
        };
    });
