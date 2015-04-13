'use strict';

angular.module('emmi.navbar', [])
    .directive('emmiNavbar', function ($window) {
        return {
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: 'admin-facing/partials/common/directives/navbar/navbar.tpl.html',
            transclude: true,
            controller: function ($scope, $element, $attrs, $transclude) {

            },
            link: function (scope, element, attrs, controller) {
                var bodyEl = angular.element($window.document.body),
                    headerEl = angular.element(element);
                bodyEl.css('padding-top', headerEl.outerHeight());
            }
        };
    })
;
