'use strict';

angular.module('emmi.navbar', [])
    .directive('emmiNavbar', ['$rootScope','$window', 'Session', '$location', '$anchorScroll',
        function ($rootScope, $window, Session, $location, $anchorScroll) {
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

                //$anchorScroll.yOffset = 50; // account for fixed header (not available in our Angular version)

                scope.gotoContent = function(hash) {
                    var newHash = hash,
                        skipTo = '#'+hash;
                    if ($location.hash() !== newHash) {
                        // set the $location.hash to `newHash` and
                        // $anchorScroll will automatically scroll to it
                        $location.hash(newHash);
                    } else {
                        // call $anchorScroll() explicitly,
                        // since $location.hash hasn't changed
                        $anchorScroll();
                    }
                    // Make sure to also shift the focus past the navigation to the element
                    // Setting 'tabindex' to -1 takes an element out of normal
                    // tab flow but allows it to be focused via javascript
                    angular.element(skipTo).attr('tabindex', -1).on('blur focusout', function () {
                        // when focus leaves this element,
                        // remove the tabindex attribute
                        angular.element(this).removeAttr('tabindex');
                     }).focus(); // focus on the content container
                };

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
