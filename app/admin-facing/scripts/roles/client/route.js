'use strict';

angular.module('emmiManager')

/**
 * Route definitions for roles
 */
    .config(function ($routeProvider, USER_ROLES) {

        // Routes
        $routeProvider
            .when('/clients/:clientId/roles', {
                templateUrl: 'admin-facing/partials/role/client/main.html',
                controller: 'ManageClientRolesMainCtrl',
                access: {
                    authorizedRoles: USER_ROLES.all
                },
                reloadOnSearch: false,
                resolve: {
                    'clientResource': ['AuthSharedService', 'Client', '$route', '$q', function (AuthSharedService, Client, $route, $q) {
                        var deferred = $q.defer();
                        AuthSharedService.currentUser().then(function () {
                            Client.selectClient($route.current.params.clientId).then(function (clientResource) {
                                if (clientResource) {
                                    deferred.resolve(clientResource);
                                } else {
                                    deferred.reject();
                                }
                            });
                        });
                        return deferred.promise;
                    }]
                }
            });
    })

    /**
     * Controller for the route landing place
     */
    .controller('ManageClientRolesMainCtrl', ['$scope', 'ManageUserRolesService', 'ManageUserTeamRolesService', 'clientResource',
        function ($scope, ManageUserRolesService, ManageUserTeamRolesService, clientResource) {
            $scope.clientResource = clientResource;
            $scope.client = clientResource.entity;
            $scope.page.setTitle('Manage User Roles - ' + clientResource.entity.name);
            $scope.loading = true;

            /**
             * Call this method from ClientRoleAdminCtrl and ClientTeamRoleAdminCtrl to set hasExistingClientRoles and hasExistingClientTeamRoles
             */
            $scope.setHasExistingRoles = function () {
                ManageUserRolesService.hasExistingClientRoles($scope.clientResource).then(function(hasClientRoles){
                    $scope.hasExistingClientRoles = hasClientRoles;
                    ManageUserTeamRolesService.hasExistingClientTeamRoles($scope.clientResource).then(function(hasClientTeamRoles){
                        $scope.hasExistingClientTeamRoles = hasClientTeamRoles;
                        $scope.loading = false;
                    });
                });
            };
        }
    ]);
