'use strict';

angular.module('emmiManager')
    .config(function ($routeProvider, USER_ROLES, MENU) {

        var requiredResources = {
            'account': ['AuthSharedService', function (AuthSharedService) {
                return AuthSharedService.currentUser();
            }]
        };

        // Routes
        $routeProvider
            .when('/', {
                redirectTo: '/clients', // main page of the site redirects to client search (EM-991)
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: requiredResources
            })
            .when('/settings', {
                templateUrl: 'admin-facing/partials/main.html',
                controller: 'MainCtrl',
                title: 'Settings',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: requiredResources
            })
            .when('/login', {
                templateUrl: 'admin-facing/partials/login.html',
                controller: 'LoginCtrl',
                title: 'Login',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: {
                    'csrf': ['API', '$http', function(API, $http){
                        // call the webapi to get an XSRF-TOKEN
                        return $http.get(API.self, {
                            ignoreAuthModule: 'ignoreAuthModule'
                        });
                    }]
                }
            })
            .when('/403', {
                templateUrl: 'admin-facing/partials/403.html',
                resolve: requiredResources,
                title: 'Access Denied',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            .when('/500', {
                templateUrl: 'admin-facing/partials/500.html',
                resolve: requiredResources,
                title: 'Server Error',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            .when('/logout', {
                templateUrl: 'admin-facing/partials/logout.html',
                controller: 'LogoutCtrl',
                title: 'Logged Out',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            .when('/docs', {
                templateUrl: 'admin-facing/partials/doc/docs.html',
                title: 'Documentation',
                activeMenu: MENU.settings,
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

