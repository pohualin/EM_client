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
                templateUrl: 'partials/main.html',
                controller: 'MainCtrl',
                title: 'Home',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: requiredResources
            })
            .when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'LoginCtrl',
                title: 'Login',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: requiredResources
            })
            .when('/403', {
                templateUrl: 'partials/403.html',
                resolve: requiredResources,
                title: 'Access Denied',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            .when('/500', {
                templateUrl: 'partials/500.html',
                resolve: requiredResources,
                title: 'Server Error',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            .when('/logout', {
                templateUrl: 'partials/main.html',
                controller: 'LogoutCtrl',
                resolve: requiredResources,
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            .when('/docs', {
                templateUrl: 'partials/doc/docs.html',
                title: 'Documentation',
                access: {
                    authorizedRoles: [USER_ROLES.god, USER_ROLES.admin]
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

