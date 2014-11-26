'use strict';

angular.module('emmiManager')

/**
 * Route definitions for roles
 */
    .config(function ($routeProvider, USER_ROLES) {

        var clientDetailRequiredResources = {
            'clientResource': ['AuthSharedService', 'Client', '$route', '$q', function (AuthSharedService, Client, $route, $q) {
                var deferred = $q.defer();
                AuthSharedService.currentUser().then(function () {
                    Client.selectClient($route.current.params.clientId).then(function (clientResource) {
                        deferred.resolve(clientResource);
                    });
                });
                return deferred.promise;
            }]
        };

        // Routes
        $routeProvider
            .when('/clients/:clientId/roles', {
                templateUrl: 'partials/role/client/main.html',
                controller: 'ManageClientRolesMainCtrl',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                reloadOnSearch: false,
                resolve: clientDetailRequiredResources
            });
    })

/**
 * Controller for the route landing place
 */
    .controller('ManageClientRolesMainCtrl', ['$scope', 'Client', 'ManageUserRolesService', 'ManageUserTeamRolesService',
        function ($scope, Client, ManageUserRolesService, ManageUserTeamRolesService) {
            $scope.client = Client.getClient().entity;
            $scope.page.setTitle('Manage User Roles - ' + $scope.client.name);
            ManageUserRolesService.referenceData().then(function (referenceData) {
                $scope.clientReferenceData = referenceData;
            });
            ManageUserTeamRolesService.referenceData();
        }
    ])

/**
 * Convert an input array into a comma delimited translated list
 */
    .filter('permissionName', ['$translate', function ($translate) {
        return function (input) {
            return input.map(function (permission) {
                return $translate.instant(permission.name);
            }).join(', ');
        };
    }])

;
