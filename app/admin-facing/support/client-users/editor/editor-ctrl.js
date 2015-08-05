'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level users
 */
.controller('UsersClientSupportEditorController', ['$alert', '$location', '$scope', 'Client', 'UsersClientService', 'UserClientUserClientRolesService', 'ManageUserRolesService', 'ManageUserTeamRolesService',
        function ($alert, $location, $scope, Client, UsersClientService, UserClientUserClientRolesService, ManageUserRolesService, ManageUserTeamRolesService) {

            $scope.client = Client.getClient();
            $scope.selectedUserClient = UsersClientService.getUserClient();
            $scope.page.setTitle('View User - ' + $scope.client.entity.name + ' | ClientManager');

            /**
             * Allows the top level editor to evaluate conditions
             * based upon the client roles used by this user
             *
             * @param roles on the user client
             */
            $scope.setClientRoles = function (roles) {
                $scope.existingUserClientUserClientRoles = roles;
            };

            /**
             * Allows the top level editor to evaluate conditions
             * based upon the team roles set for this user
             *
             * @param roles on the user client
             */
            $scope.setClientTeamRoles = function (roles) {
                $scope.teamRoles = roles;
            };

            /**
             * Metadata has changed, reset the UserClient
             */
            $scope.metadataChanged = function(){
                $scope.selectedUserClient = UsersClientService.getUserClient();
            };

            /**
             * Called when 'Create Another User' is clicked
             */
            $scope.createAnotherUserClient = function () {
                UserClientUserClientRolesService.clearAllPermissions();
                $location.path('/clients/' + $scope.client.entity.id + '/users/new');
            };
            
            /**
             * Load existing UserClientRole and UserClientTeamRoles
             */
            $scope.loadUserRolesSection = function() {
                // 1. Load user client roles
                ManageUserRolesService.loadClientRolesWithPermissions(Client.getClient()).then(function (clientRoles) {
                    $scope.clientRoles = clientRoles;
                });
                // 2. Load user client team roles
                ManageUserTeamRolesService.loadClientTeamRoles(Client.getClient()).then(function(clientTeamRoles){
                    $scope.clientTeamRoles = clientTeamRoles;
                    $scope.$broadcast('loadTeamsForClientTeamRoles');
                });
            };

            /**
             * Load existingUserClientUserClientRoles for the UserClient
             */
            $scope.loadExistingUserClientUserClientRoles = function () {
                UserClientUserClientRolesService.
                    getUserClientUserClientRoles($scope.selectedUserClient).then(function (response) {
                        // Set existingUserClientUserClientRoles if it exists
                        if (response.length > 0) {
                            UserClientUserClientRolesService
                                .loadPermissionsForUserClientUserClientRoles(response).then(function (response) {
                                    $scope.existingUserClientUserClientRoles = response;
                                    $scope.setClientRoles($scope.existingUserClientUserClientRoles);
                                });
                        } else {
                            // Load existing UserClientRoles for the Client
                            $scope.existingUserClientUserClientRoles = null;
                            $scope.setClientRoles($scope.existingUserClientUserClientRoles);
                            UserClientUserClientRolesService.clearAllPermissions();
                        }
                    });
            };

            $scope.$watch(function(){
                return UserClientUserClientRolesService.isSuperUser();
            }, function(newValue) {
                $scope.isSuperUser = newValue;
            });
            
            $scope.$on('client-roles-changed', function () {
                $scope.loadExistingUserClientUserClientRoles();
            });
            
            (function init(){
                $scope.existingUserClientUserClientRoles = null;
                UserClientUserClientRolesService.clearAllPermissions();
                $scope.loadUserRolesSection();
                $scope.loadExistingUserClientUserClientRoles();
            })();
        }
    ])
/**
 * This filter loops over the set of team roles on the client
 * and looks for existingTeam roles. It returns true if
 * there is any team selected for any of the team roles.
 */
    .filter('teamSetOnRole', function () {
        return function (teamRoles) {
            var hasTeamRole = false;
            angular.forEach(teamRoles, function (teamRole) {
                if (teamRole.existingTeams && teamRole.existingTeams.length > 0) {
                    hasTeamRole = true;
                }
            });
            return hasTeamRole;
        };
    })
;
