'use strict';

angular.module('emmi.navbar', [])
    .directive('emmiNavbar', function () {
        return {
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: '/admin-facing/partials/common/directives/navbar/navbar.tpl.html',
            transclude: true,
            controller: function ($scope, $element, $attrs, $transclude) {

            },
            link: function (scope, element, attrs, controller) {

            }
        };
    })
;
