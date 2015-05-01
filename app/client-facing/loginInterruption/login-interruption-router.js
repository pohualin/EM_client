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

                    userClientReqdResource: ['AuthSharedService', 'ProfileService', '$q','CommonService', function (AuthSharedService, ProfileService, $q,CommonService) {
                        var deferred = $q.defer();
                        AuthSharedService.currentUser().then(function (loggedInUser) {
                            ProfileService.get(loggedInUser).then(function (refreshedUserResponse) {
                                deferred.resolve(refreshedUserResponse);
                            }, function(){
                                deferred.reject();
                            });
                        },function(){
                            deferred.reject();
                        });
                        return deferred.promise;
                    }],

                    userData:['$rootScope', function ($rootScope) {
                            return $rootScope.userData;
                    }]

                }
            });
    })
;
