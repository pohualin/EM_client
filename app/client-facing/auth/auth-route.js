'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

        // Routes
        $routeProvider

            .when('/login', {
                templateUrl: 'client-facing/auth/login.html',
                controller: 'LoginCtrl',
                title: 'Login',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            .when('/logout', {
                templateUrl: 'client-facing/main/main.html',
                controller: 'LogoutCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
    })
;

