'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

        var requiredResources = {
            'account': ['AuthSharedService', function (AuthSharedService) {
                return AuthSharedService.currentUser();
            }]
        };

        // Routes
        $routeProvider
            .when('/validateEmail', {
                templateUrl: 'client-facing/validateEmail/validate_email.html',
                controller: 'validateEmail',
                resolve: {
                    account: requiredResources.account,
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
                },
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
    })
;
