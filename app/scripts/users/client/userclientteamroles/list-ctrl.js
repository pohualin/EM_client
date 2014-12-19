'use strict';

angular.module('emmiManager')

/**
 * Controller for list of UserClientUserClientTeamRole
 */
.controller('UsersClientUserClientTeamRolesListController', 
		['$controller', '$scope', 'Client', 'TeamsFilter', 'ManageUserTeamRolesService', 'UsersClientService', 'UserClientUserClientTeamRolesService',
        function ($controller, $scope, Client, TeamsFilter, ManageUserTeamRolesService, UsersClientService, UserClientUserClientTeamRolesService) {
			
			/**
    		 * load all UserClientTeamRoles for the client
    		 */
    		$scope.loadClientTeamRoles = function(){
    			ManageUserTeamRolesService.loadClientTeamRoles().then(function(clientTeamRoles){
					$scope.clientTeamRoles = clientTeamRoles;
					UserClientUserClientTeamRolesService.refreshTeamRoleCards($scope.clientTeamRoles);
				});
    		};
			
    		/**
    		 * Call when ClientTeamRole panel changed
    		 */
			$scope.panelStateChange = function(clientTeamRole){
				// Fetch all permissions tied to clientTeamRole
				ManageUserTeamRolesService.loadAllPermissions(clientTeamRole);
				// UserClientUserClientTeamRolesService.refreshTeamRoleCards(clientTeamRole);
			};
			
			/**
			 * Remove all UserClientUserClientTeamRole
			 */
			$scope.removeAllUserClientUserClientTeamRole = function(clientTeamRole){
				UserClientUserClientTeamRolesService.deleteAllUserClientUserClientTeamRole(clientTeamRole).then(function(response){
					UserClientUserClientTeamRolesService.refreshTeamRoleCard(clientTeamRole);
				});
			};
			
			/**
			 * Delete one UserClientUserClientTeamRole
			 */
			$scope.removeUserClientUserClientTeamRole = function(clientTeamRole, existingTeam){
				UserClientUserClientTeamRolesService.deleteUserClientUserClientTeamRole(existingTeam).then(function(response){
					UserClientUserClientTeamRolesService.refreshTeamRoleCard(clientTeamRole);
				});
			};
    		
    		/**
			 * Set hasTeams to true is there is at least a teams for the client
			 */
			$scope.setHasTeams = function(){
				TeamsFilter.getClientTeams().then(function(response){
					if(response && response.length > 0){
						$scope.hasTeams = true;
					} else {
						$scope.hasTeams = false;
					}
				});
			};
            
    		/**
	         * init method called when the page is loading
	         */
            function init(){
            	$controller('CommonSearch', {$scope: $scope});
            	$scope.client = Client.getClient();
                $scope.loadClientTeamRoles();
                $scope.setHasTeams();
            }
            
            init();
        }
    ])
;
