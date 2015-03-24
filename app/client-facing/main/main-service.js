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

    .directive('ngRightClick', function ($parse) {
        return function (scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function (event) {
                scope.$apply(function () {
                    event.preventDefault();
                    fn(scope, {$event: event});
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
            toQueryString: function (object) {
                var array = [];
                angular.forEach(object, function (value, key) {
                    array.push(key + '=' + value);
                });
                return array.join('&');
            }
        };
    })

    .service('MainService',['$http', 'UriTemplate', 'moment', '$q',
     function ($http, UriTemplate, moment, $q) {
        return {
            /**
             * Check to see if the passed account should show a reminder for password
             * expiration
             *
             * @param account to check
             * @returns {Deferred}
             */
            checkPasswordExpiration: function(account){
                var deferred = $q.defer(),
                    ret = {
                        showReminder: false,
                        passwordExpiresInDays: 0
                    };
                if (account && account.passwordExpirationTime && account.clientResource) {
                    var daysUntilExpiration = moment(account.passwordExpirationTime).diff(moment(), 'days') + 1;
                    $http.get(UriTemplate.create(account.clientResource.link.passwordPolicy).stringify())
                        .success(function (response) {
                            if (daysUntilExpiration <= response.passwordExpirationDaysReminder) {
                                ret.showReminder = true;
                                ret.passwordExpiresInDays = daysUntilExpiration;
                                deferred.resolve(ret);
                            }
                        }, function fail() {
                            deferred.resolve(ret);
                        });
                } else {
                  deferred.resolve(ret);
                }
                return deferred.promise;
            },

            /**
             * Return an array of Team objects for which this user has the passed permission
             * @param account
             * @returns {*}
             */
            specificTeamsHavingLink: function(account, linkName){
                var deferred = $q.defer(),
                    teams = [];
                if (account && account.teams){
                    angular.forEach(account.teams, function (team){
                        if (team.link[linkName]){
                            teams.push(team);
                        }
                    });
                    deferred.resolve(teams);
                } else {
                    deferred.resolve(teams);
                }
                return deferred.promise;
            }
        };
    }])
;
