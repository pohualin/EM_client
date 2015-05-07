'use strict';

angular.module('ngTinyScrollbar')
    .directive('sidebarScroller', function ($window, $timeout) {
        return {
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
            link: function (scope, element, attrs, controller) {
                var setMaxHeight = function() {
                    var windowEl = angular.element($window),
                        sidebarEl = angular.element('.app-content-with-sidebar .sidebar');
                    if (sidebarEl.length) {
                        var calcHeight = 0,
                            ignoreHeight = 100, // start at (top nav bar + sidebar top/bottom padding)
                            ignoreHeightEls = sidebarEl.find('.sidebar-heading, .sidebar-filters');
                        ignoreHeightEls.each(function(index, el) {
                            ignoreHeight += angular.element(el).outerHeight(true);
                        });
                        calcHeight = windowEl.outerHeight(true) - ignoreHeight;
                        //element.find('scroll-viewport').css('max-height', calcHeight);
                        element.height(calcHeight);
                    }
                };
                setMaxHeight();
                $timeout(function() {
                    angular.element($window).trigger('resize');
                }, 1000);
            }
        };
    })
;
