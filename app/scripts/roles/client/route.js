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
                        if (clientResource) {
                            deferred.resolve(clientResource);
                        } else {
                            deferred.reject();
                        }
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
    .controller('ManageClientRolesMainCtrl', ['$scope', 'Client', 'ManageUserRolesService', 'UsersClientService',
        function ($scope, Client, ManageUserRolesService, UsersClientService) {
            $scope.manageUserRolesService = ManageUserRolesService;
            $scope.client = Client.getClient().entity;
            $scope.page.setTitle('Manage User Roles - ' + $scope.client.name);

            UsersClientService.list(Client.getClient()).then(function (response) {
                if (response && response.page && response.page.totalElements > 0) {
                    $scope.hasUsers = true;
                }
            });

            /**
             * Call this method from ClientRoleAdminCtrl to set hasExistingClientRoles
             */
            $scope.setHasExistingClientRoles = function () {
                $scope.hasExistingClientRoles = ManageUserRolesService.hasExistingClientRoles();
            };
        }
    ])

;
