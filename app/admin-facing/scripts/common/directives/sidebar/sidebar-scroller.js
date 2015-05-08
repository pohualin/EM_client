'use strict';

angular.module('ngTinyScrollbar')
    .directive('sidebarScroller', ['$window', '$timeout', function ($window, $timeout) {
        return {
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
            link: function (scope, element, attrs, controller) {
                var setMaxHeight = function () {
                    var mainContentEl = angular.element('.app-content-with-sidebar .main-content'),
                        sidebarEl = angular.element('.app-content-with-sidebar .sidebar');
                    if (mainContentEl.length && sidebarEl.length) {
                        var ignoreHeight = 0, // start at (top nav bar + sidebar top/bottom padding)
                            ignoreHeightEls = sidebarEl.find('.sidebar-heading, .sidebar-filters');
                        ignoreHeightEls.each(function (index, el) {
                            ignoreHeight += angular.element(el).outerHeight(true);
                        });
                        element.height(mainContentEl.outerHeight(true) - ignoreHeight);
                        $timeout(function () {
                            angular.element($window).triggerHandler('resize');
                        });
                    }
                };
                // watch for right side height changes
                scope.$watch(function () {
                    var mainContentEl = angular.element('.app-content-with-sidebar .main-content');
                    if (mainContentEl.length) {
                        return mainContentEl.outerHeight(true);
                    }
                }, function onHeightChange(before, after) {
                    if (scope.pendingHeightChange) {
                        $timeout.cancel(scope.pendingHeightChange);
                    }
                    scope.pendingHeightChange = $timeout(function () {
                        setMaxHeight();
                    }, 500);
                });

                // watch for left side height changes
                scope.$watch(function () {
                    var sidebarEl = element.find('.scroll-overview');
                    if (sidebarEl.length) {
                        return angular.element(sidebarEl[0]).height();
                    }
                }, function onElementHeightChange() {
                    if (scope.resizeTrigger) {
                        $timeout.cancel(scope.resizeTrigger);
                    }
                    scope.resizeTrigger = $timeout(function () {
                        setMaxHeight();
                    }, 500);
                });
            }
        };
    }])
;
