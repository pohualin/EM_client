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
            .when('/roles/client', {
                templateUrl: 'partials/role/client/main.html',
                controller: 'ClientRoleAdminMainCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                reloadOnSearch: false,
                title: 'Client Role Administration',
                resolve: requiredResources
            });
    })

;
