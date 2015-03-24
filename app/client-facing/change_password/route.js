'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

        // Routes
        $routeProvider
            .when('/change_password', {
                templateUrl: 'client-facing/change_password/main.html',
                controller: 'ChangePasswordController',
                title: 'Change Password',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: {
                    'account': ['AuthSharedService', function (AuthSharedService) {
                        return AuthSharedService.currentUser();
                    }]
                }
            });
    })
;
