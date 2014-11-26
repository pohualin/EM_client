'use strict';

angular.module('emmiManager')

/**
 * This directive allows for both single and double click handlers to happen on the same element.
 * It works by essentially delaying the single click action for 250ms in case another click occurs.
 * If at the end of the delay, only a single click has occurred then the single click action will
 * be performed.
 *
 *       <button ng-dblclick="count = count + 1" data-sqlclick="count=0">
 *               Increment (on double click), reset on single click
 *       </button>
 */
    .directive('sglclick', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var fn = $parse(attr.sglclick);
                var delay = 250, clicks = 0, timer = null;
                element.on('click', function (event) {
                    clicks++;  //count clicks
                    if (clicks === 1) {
                        timer = setTimeout(function () {
                            scope.$apply(function () {
                                fn(scope, {$event: event});
                            });
                            clicks = 0;         //action performed, reset counter
                        }, delay);
                    } else {
                        clearTimeout(timer);    //prevent single-click action
                        clicks = 0;             //after action performed, reset counter
                    }
                });
            }
        };
    }])
;
