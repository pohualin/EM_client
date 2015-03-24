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
            .when('/unauthorized', {
                templateUrl: 'client-facing/auth/user_totally_unauthorized.html',
                title: 'Ip Not Allowed'
            })
            .when('/logout', {
                templateUrl: 'client-facing/main/main.html',
                controller: 'LogoutCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            });
    })
;

