'use strict';

angular.module('emmiManager')

/**
 * Controller for list of UserClientUserClientTeamRole
 */
    .controller('UsersClientUserClientTeamRolesSupportListController',
		['$controller', '$scope', 'Client', 'TeamsFilter', 'ManageUserTeamRolesService', 'UsersClientService', 'UserClientUserClientTeamRolesService',
        function ($controller, $scope, Client, TeamsFilter, ManageUserTeamRolesService, UsersClientService, UserClientUserClientTeamRolesService) {

            /**
    		 * Called when ClientTeamRole panel changed
    		 */
			$scope.panelStateChange = function(clientTeamRole){
				// Fetch all permissions tied to clientTeamRole if panel is open
                if (clientTeamRole.activePanel === 0) { // this fires before bs-collapse
				    ManageUserTeamRolesService.loadAllPermissions(clientTeamRole);
                }
			};

            /**
			 * Remove all UserClientUserClientTeamRole
			 */
			$scope.removeAllUserClientUserClientTeamRole = function(clientTeamRole){
                $scope.whenSaving = true;
                UserClientUserClientTeamRolesService.deleteAllUserClientUserClientTeamRole(clientTeamRole).then(function () {
					UserClientUserClientTeamRolesService.refreshTeamRoleCard(clientTeamRole);
                }).finally(function () {
                    $scope.whenSaving = false;
                });
				_paq.push(['trackEvent', 'Form Action', 'User Team Role Team', 'Remove All']);
			};

            /**
			 * Delete one UserClientUserClientTeamRole
			 */
			$scope.removeUserClientUserClientTeamRole = function(clientTeamRole, existingTeam){
                $scope.whenSaving = true;
                UserClientUserClientTeamRolesService.deleteUserClientUserClientTeamRole(existingTeam).then(function () {
					UserClientUserClientTeamRolesService.refreshTeamRoleCard(clientTeamRole);
                }).finally(function () {
                    $scope.whenSaving = false;
                });
				_paq.push(['trackEvent', 'Form Action', 'User Team Role Team', 'Remove']);
			};
			
			/**
             * load all UserClientTeamRoles for the client
             */
            $scope.$on('loadTeamsForClientTeamRoles', function(){
                UserClientUserClientTeamRolesService.refreshTeamRoleCards($scope.clientTeamRoles);
            });

            /**
	         * init method called when the page is loading
	         */
            function init(){
            	$controller('CommonSearch', {$scope: $scope});
            	$scope.client = Client.getClient();
            }

            init();
        }
    ])
;
