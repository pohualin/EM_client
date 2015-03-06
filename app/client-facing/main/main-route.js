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
            .when('/', {
                templateUrl: 'client-facing/main/main.html',
                controller: 'MainCtrl',
                title: 'Home',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: requiredResources
            })
            .when('/403', {
                templateUrl: 'client-facing/main/403.html',
                resolve: requiredResources,
                title: 'Access Denied',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            .when('/500', {
                templateUrl: 'client-facing/main/500.html',
                resolve: requiredResources,
                title: 'Server Error',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            .when('/docs', {
                templateUrl: 'client-facing/doc/docs.html',
                title: 'Documentation',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })
            .otherwise({
                redirectTo: '/',
                resolve: requiredResources,
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            });
    })


;

