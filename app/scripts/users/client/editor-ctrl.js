'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level users
 */
.controller('UsersClientEditorController', ['$alert', '$location', '$scope', 'Client', 'UsersClientService', 'UserClientUserClientRolesService',
        function ($alert, $location, $scope, Client, UsersClientService, UserClientUserClientRolesService) {

            $scope.client = Client.getClient();
            $scope.selectedUserClient = UsersClientService.getUserClient();
            $scope.page.setTitle('View User - ' + $scope.client.entity.name);

            /**
             * Allows the top level editor to evaluate conditions
             * based upon the client roles used by this user
             *
             * @param roles on the user client
             */
            $scope.setClientRoles = function (roles) {
                $scope.clientRoles = roles;
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
             * Called when 'Create Another User' is clicked
             */
            $scope.createAnotherUserClient = function () {
                UserClientUserClientRolesService.clearAllPermissions();
                $location.path('/clients/' + $scope.client.entity.id + '/users/new');
            };

            /**
             * Called if the user confirms they want to navigate away from the page when clicking the clink link-back
             */
            $scope.confirmExit = function() {
                $location.path('/clients/'+$scope.client.entity.id);
            };

            $scope.setLoading = function(){
                $scope.loading = true;
            };

            /**
             * Call and check if user is assigned to Super user.
             */
            $scope.setIsSuperUser = function(){
                $scope.isSuperUser = UserClientUserClientRolesService.isSuperUser();
                $scope.loading = false;
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
