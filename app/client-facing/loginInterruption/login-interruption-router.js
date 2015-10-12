'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {
        // Routes
        $routeProvider
            .when('/passwordInformation', {
                templateUrl: 'client-facing/loginInterruption/login_interruption_main.html',
                controller: 'loginInterruption',
                title: 'Request Information',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: {
                    account: ['AuthSharedService','$q', function (AuthSharedService,$q) {
                        var deferred = $q.defer();
                        AuthSharedService.currentUser().then(function (loggedInUser) {
                            if (loggedInUser.password) {
                                deferred.resolve(loggedInUser);
                            } else {
                                deferred.reject();
                            }
                        });
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
