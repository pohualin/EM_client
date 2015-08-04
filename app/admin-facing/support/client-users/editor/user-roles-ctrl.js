'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level users
 */
.controller('UserClientSupportUserRolesController', ['$q', '$alert', '$location', '$scope', 'Client', 'UsersClientService', 'UserClientUserClientRolesService', 'ManageUserRolesService', 'ManageUserTeamRolesService',
        function ($q, $alert, $location, $scope, Client, UsersClientService, UserClientUserClientRolesService, ManageUserRolesService, ManageUserTeamRolesService) {
            
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
                                });
                        } else {
                            // Load existing UserClientRoles for the Client
                            $scope.existingUserClientUserClientRoles = null;
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
            
            function init(){
                $scope.existingUserClientUserClientRoles = null;
                UserClientUserClientRolesService.clearAllPermissions();
                $scope.loadUserRolesSection();
                $scope.loadExistingUserClientUserClientRoles();
            }
            init();
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
