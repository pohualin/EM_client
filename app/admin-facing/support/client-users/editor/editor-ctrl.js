'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level users
 */
.controller('UsersClientSupportEditorController', ['$alert', '$location', '$scope', 'Client', 'UsersClientService', 'UserClientUserClientRolesService',
        function ($alert, $location, $scope, Client, UsersClientService, UserClientUserClientRolesService) {

            $scope.client = Client.getClient();
            $scope.selectedUserClient = UsersClientService.getUserClient();
            $scope.page.setTitle('View User - ' + $scope.client.entity.name);
            $scope.isSuperUser = false;

            /**
             * Allows the top level editor to evaluate conditions
             * based upon the client roles used by this user
             *
             * @param roles on the user client
             */
            $scope.setClientRoles = function (roles) {
                $scope.clientRoles = roles;
            };

            $scope.setPossibleClientRoles = function (possibleRoles) {
                $scope.possibleClientRoles = possibleRoles;
            };

            $scope.clientRolesChanged = function (){
                $scope.$broadcast('client-roles-changed');
            };

            /**
             * Allows the top level editor to evaluate conditions
             * based upon the team roles set for this user
             *
             * @param roles on the user client
             */
            $scope.setTeamRoles = function (roles) {
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
             * Call and check if user is assigned to Super user.
             */
            $scope.setIsSuperUser = function(){
                $scope.isSuperUser = UserClientUserClientRolesService.isSuperUser();
            };

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
