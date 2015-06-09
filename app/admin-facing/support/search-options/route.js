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
            .when('/support', {
                redirectTo: '/support/client_users',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                },
                resolve: requiredResources
            })
            .when('/support/client_users', {
                templateUrl: 'admin-facing/support/client-users/search/search.html',
                controller: 'ClientUsersSupportSearchCtrl',
                access: {
                    authorizedRoles: USER_ROLES.all
                },
                activeMenu: MENU.support,
                reloadOnSearch: false,
                resolve: requiredResources
            });
    });
