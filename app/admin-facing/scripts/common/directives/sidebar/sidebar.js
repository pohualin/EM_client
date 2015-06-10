'use strict';

angular.module('emmiManager')
    .directive('emmiSidebar', ['$window', '$timeout', 'debounce', function ($window, $timeout, debounce) {
        return {
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
            link: function (scope, element, attrs, controller) {
                $timeout(function () {
                    var mainContentEl = element.next('.main-content'),
                        headerEl = angular.element('.app-header'),
                        footerEl = angular.element('.footer'),
                        resizeFn = debounce(function() {
                            sizeContent();
                        }, 250);
                    function sizeContent() {
                        mainContentEl.css('min-height', $window.innerHeight - headerEl.outerHeight() - footerEl.outerHeight() - 48);
                    }
                    angular.element($window).on('resize', resizeFn);
                    sizeContent();
                });
            }
        };
    }])
;
