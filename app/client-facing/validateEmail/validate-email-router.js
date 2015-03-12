'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {
        // Routes
        $routeProvider
            .when('/validateEmail', {
                templateUrl: 'client-facing/validateEmail/validate_email.html',
                controller: 'validateEmail',
                title: 'Validate Email',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: {
                    account: ['AuthSharedService', function (AuthSharedService) {
                        return AuthSharedService.currentUser();
                    }],
                    locationBeforeLogin: ['$rootScope', '$q',
                        function ($rootScope, $q) {
                            var deferred = $q.defer();
                            if ($rootScope.locationBeforeLogin) {
                                deferred.resolve($rootScope.locationBeforeLogin.path());
                            } else {
                                deferred.resolve('/');
                            }
                            return deferred.promise;
                        }],
                    validationKey: [function () {
                      return null;
                    }]
                }
            })
            .when('/validateEmail/:validationKey', {
                templateUrl: 'client-facing/main/main.html',
                controller: 'validateEmail',
                title: 'Validate Email',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: {
                    account: ['AuthSharedService', function (AuthSharedService) {
                        return AuthSharedService.currentUser();
                    }],
                    validationKey: ['$route', '$q', function ($route, $q) {
                        var deferred = $q.defer();
                        if ($route.current.params.validationKey) {
                            deferred.resolve($route.current.params.validationKey);
                        } else {
                            deferred.reject();
                        }
                        return deferred.promise;
                    }],
                    locationBeforeLogin: ['$rootScope', '$q',
                        function ($rootScope, $q) {
                            var deferred = $q.defer();
                            if ($rootScope.locationBeforeLogin) {
                                deferred.resolve($rootScope.locationBeforeLogin.path());
                            } else {
                                deferred.resolve('/');
                            }
                            return deferred.promise;
                        }]
                }
            });
})
;
