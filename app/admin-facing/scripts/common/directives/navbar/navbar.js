'use strict';

angular.module('emmi.navbar', [])
    .directive('emmiNavbar', function ($rootScope, $window, $location) {
        return {
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: 'admin-facing/partials/common/directives/navbar/navbar.tpl.html',
            transclude: true,
            controller: function ($scope, $element, $attrs, $transclude) {
                var filename = $window.location.pathname.substring($window.location.pathname.lastIndexOf('/')+1);
                $scope.siteTool = filename.replace('.html', '');
            },
            link: function (scope, element, attrs, controller) {
                var bodyEl = angular.element($window.document.body),
                    headerEl = angular.element(element);
                bodyEl.css('padding-top', headerEl.outerHeight());
            }
        };
    })
;
