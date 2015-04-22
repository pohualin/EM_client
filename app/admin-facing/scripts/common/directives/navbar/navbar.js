'use strict';

angular.module('emmi.navbar', [])
    .directive('emmiNavbar', ['$rootScope','$window', 'Session',
        function ($rootScope, $window, Session) {
        return {
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: 'admin-facing/partials/common/directives/navbar/navbar.tpl.html',
            transclude: true,
            controller: function ($scope, $element, $attrs, $transclude) {
                var filename = $window.location.pathname.substring($window.location.pathname.lastIndexOf('/')+1);
                $scope.siteTool = filename.replace('.html', '');
                $scope.account = Session;

            },
            link: function (scope, element, attrs, controller) {
                var bodyEl = angular.element($window.document.body),
                    headerEl = angular.element(element);
                bodyEl.css('padding-top', headerEl.outerHeight());
            }
        };
    }])

/**
 * These are the main menu options present in the navigation bar.
 * These are bound to the view to enable the highlighted/active menu.
 * These are used in the $routeProvider declarations.
 */
    .constant('MENU', {
        setup: 'MENU_SETUP',
        support: 'MENU_SUPPORT',
        reports: 'MENU_REPORTS',
        messages: 'MENU_MESSAGES',
        help: 'MENU_HELP',
        settings: 'MENU_SETTINGS'
    })
;
