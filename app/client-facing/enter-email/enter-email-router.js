'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {
        // Routes
        $routeProvider
            .when('/addEmail', {
                templateUrl: 'client-facing/enter-email/enter_email.html',
                controller: 'enterEmail',
                title: 'Enter Email',
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
                        }]
                }
            });
    })
;
