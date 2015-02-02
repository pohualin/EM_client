'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

        // Routes
        $routeProvider

            .when('/credentials/expired', {
                templateUrl: 'client-facing/credentials/expired/expired.html',
                controller: 'CredentialsExpiredController',
                title: 'Credentials Expired',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: {
                    'credentials': ['$rootScope', '$q',
                        function ($rootScope, $q) {
                            var deferred = $q.defer();
                            if ($rootScope.expiredCredentials) {
                                deferred.resolve($rootScope.expiredCredentials)
                            } else {
                                deferred.reject();
                            }
                            return deferred.promise;
                        }]
                }
            })

            .when('/activate/:activationKey', {
                templateUrl: 'client-facing/credentials/activation/activate.html',
                controller: 'ActivateClientUserController',
                title: 'Client User Activation',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: {
                    'activationCode': ['$route', '$q', function ($route, $q) {
                        var deferred = $q.defer();
                        if ($route.current.params.activationKey) {
                            deferred.resolve($route.current.params.activationKey);
                        } else {
                            deferred.reject();
                        }
                        return deferred.promise;
                    }]
                }
            })
    })
;
