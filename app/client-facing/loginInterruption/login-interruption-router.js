'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {
        // Routes
        $routeProvider
            .when('/passwordInformation', {
                templateUrl: 'client-facing/loginInterruption/login_interruption.html',
                controller: 'loginInterruption',
                title: 'Request Information',
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
