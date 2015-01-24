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
    })
;
