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
                    $timeout(function(){
                        elem[0].focus();
                    }, 0);
                }
            });
        };
    })

<<<<<<< HEAD
    .directive('autoFocus', function($timeout) {
        return {
            restrict: 'AC',
            link: function(_scope, _element) {
                $timeout(function(){
                    _element[0].focus();
                }, 250);
            }
        };
    })
;
=======
    // From http://stackoverflow.com/questions/13320015/how-to-write-a-debounce-service-in-angularjs
    .factory('debounce', function ($timeout, $q) {
        return function(func, wait, immediate) {
            var timeout;
            var deferred = $q.defer();
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if(!immediate) {
                        deferred.resolve(func.apply(context, args));
                        deferred = $q.defer();
                    }
                };
                var callNow = immediate && !timeout;
                if ( timeout ) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(later, wait);
                if (callNow) {
                    deferred.resolve(func.apply(context,args));
                    deferred = $q.defer();
                }
                return deferred.promise;
            };
        };
    })

;
>>>>>>> 23b536c4089542840f699897b6072079d0bd6691
