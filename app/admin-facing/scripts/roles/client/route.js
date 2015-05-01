'use strict';

angular.module('emmiManager')

/**
 * Route definitions for roles
 */
    .config(function ($routeProvider, USER_ROLES, MENU) {

        // Routes
        $routeProvider
            .when('/clients/:clientId/roles', {
                templateUrl: 'admin-facing/partials/role/client/main.html',
                controller: 'ManageClientRolesMainCtrl',
                activeMenu: MENU.setup,
                access: {
                    authorizedRoles: USER_ROLES.all
                },
                reloadOnSearch: false,
                resolve: {
                    'clientResource': ['AuthSharedService', 'Client', '$route', '$q',
                        'ManageUserRolesService', 'ManageUserTeamRolesService',
                        function (AuthSharedService, Client, $route, $q,
                                  ManageUserRolesService, ManageUserTeamRolesService) {
                            var deferred = $q.defer();
                            AuthSharedService.currentUser().then(function () {
                                Client.selectClient($route.current.params.clientId).then(function (clientResource) {
                                    if (clientResource) {
                                        // load the reference data
                                        var userRolesRefData = ManageUserRolesService.referenceData(clientResource)
                                            .then(function (referenceData) {
                                                return referenceData;
                                            });
                                        var teamRolesRefData = ManageUserTeamRolesService.referenceData(clientResource)
                                            .then(function (referenceData) {
                                                return referenceData;
                                            });
                                        $q.all([userRolesRefData, teamRolesRefData]).then(function (responses) {
                                            clientResource.ref = {
                                                clientRoleReferenceData: responses[0],
                                                clientRoleLibraries: responses[0].roleLibrary,
                                                clientTeamReferenceData: responses[1],
                                                clientTeamRoleLibraries: responses[1].roleLibrary
                                            };
                                            deferred.resolve(clientResource);
                                        });
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
             * Call this method from ClientRoleAdminCtrl and ClientTeamRoleAdminCtrl to
             * set hasExistingClientRoles and hasExistingClientTeamRoles
             */
            $scope.setHasExistingRoles = function () {
                ManageUserRolesService.hasExistingClientRoles($scope.clientResource).then(function (hasClientRoles) {
                    $scope.hasExistingClientRoles = hasClientRoles;
                    ManageUserTeamRolesService.hasExistingClientTeamRoles($scope.clientResource).then(function (hasClientTeamRoles) {
                        $scope.hasExistingClientTeamRoles = hasClientTeamRoles;
                        $scope.loading = false;
                    });
                });
            };
        }
    ]);
