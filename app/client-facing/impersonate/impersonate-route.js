'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES) {

        // Routes
        $routeProvider
            .when('/impersonate/:clientId/:nextRoute*', {
                templateUrl: 'client-facing/impersonate/impersonate.html',
                controller: 'ImpersonationController',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                reloadOnSearch: false
            })

            .when('/impersonate/:clientId', {
                templateUrl: 'client-facing/impersonate/impersonate.html',
                controller: 'ImpersonationController',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                reloadOnSearch: false
            });
    })
;

