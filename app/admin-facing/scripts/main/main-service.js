'use strict';

angular.module('emmiManager')

    .factory('focus', function ($rootScope, $timeout) {
        return function (name) {
            $timeout(function () {
                $rootScope.$broadcast('focusOn', name);
            });
        };
    })

    .directive('focusOn', function ($timeout) {
        return function (scope, elem, attr) {
            scope.$on('focusOn', function (e, name) {
                if (name === attr.focusOn) {
                    $timeout(function () {
                        elem[0].focus();
                    }, 0);
                }
            });
        };
    })

    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind('keydown keypress', function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })

    .directive('ngRightClick', function($parse) {
        return function(scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function(event) {
                scope.$apply(function() {
                    event.preventDefault();
                    fn(scope, {$event:event});
                });
            });
        };
    })

    .directive('autoFocus', function ($timeout) {
        return {
            restrict: 'AC',
            link: function (_scope, _element) {
                $timeout(function () {
                    _element[0].focus();
                }, 250);
            }
        };
    })

    // From http://stackoverflow.com/questions/13320015/how-to-write-a-debounce-service-in-angularjs
    .factory('debounce', function ($timeout, $q) {
        return function (func, wait, immediate) {
            var timeout;
            var deferred = $q.defer();
            return function () {
                var context = this, args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate) {
                        deferred.resolve(func.apply(context, args));
                        deferred = $q.defer();
                    }
                };
                var callNow = immediate && !timeout;
                if (timeout) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(later, wait);
                if (callNow) {
                    deferred.resolve(func.apply(context, args));
                    deferred = $q.defer();
                }
                return deferred.promise;
            };
        };
    })

    .factory('arrays', function () {
        return {
            convertToObject: function (keyItem, valueItem, array) {
                var obj = {};
                angular.forEach(array, function (item) {
                    if (item[keyItem] && item[valueItem]) {
                        obj[item[keyItem]] = item[valueItem];
                    }
                });
                return obj;
            },
            toQueryString: function(object){
                var str = [];
                for (var p in object) {
                    if (object.hasOwnProperty(p)) {
                        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(object[p]));
                    }
                }
                return str.join('&');
            }
        };
    })


;
