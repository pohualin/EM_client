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
            .when('/admin', {
                templateUrl: 'admin-facing/partials/admin/index.html',
                controller: 'AdminFuncsCtrl',
                title: 'Admin Functions | ClientManager',
                activeMenu: MENU.settings,
                access: {
                    authorizedRoles: USER_ROLES.all
                }
            }).when('/admin/tags', {
            	templateUrl: 'admin-facing/partials/admin/tags/editor.html',
                controller: 'AdminTagsCtrl',
                title: 'Manage Groups & Tags Library | ClientManager',
                activeMenu: MENU.settings,
                resolve: requiredResources,
                access: {
                    authorizedRoles: USER_ROLES.all
                }
            });
    })

;
