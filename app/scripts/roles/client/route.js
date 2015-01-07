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
    .controller('ManageClientRolesMainCtrl', ['$scope', 'Client', 'ManageUserRolesService',
        function ($scope, Client, ManageUserRolesService) {
            $scope.client = Client.getClient().entity;
            $scope.page.setTitle('Manage User Roles - ' + $scope.client.name);
            
            /**
             * Call this method from ClientRoleAdminCtrl to set hasExistingClientRoles
             */
            $scope.setHasExistingClientRoles = function(){
                $scope.hasExistingClientRoles = ManageUserRolesService.hasExistingClientRoles();
            };
        }
    ])

;
