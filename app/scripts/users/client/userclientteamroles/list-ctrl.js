'use strict';

angular.module('emmiManager')

/**
 * Controller for list of UserClientUserClientTeamRole
 */
.controller('UsersClientUserClientTeamRolesListController', 
		['$controller', '$scope', 'Client', 'ManageUserTeamRolesService', 'UsersClientService', 'UserClientUserClientTeamRolesService',
        function ($controller, $scope, Client, ManageUserTeamRolesService, UsersClientService, UserClientUserClientTeamRolesService) {
			
			/**
    		 * load all UserClientTeamRoles for the client
    		 */
    		$scope.loadClientTeamRoles = function(){
    			ManageUserTeamRolesService.loadClientTeamRoles().then(function(clientTeamRoles){
					$scope.clientTeamRoles = clientTeamRoles;
				});
    		};
			
    		/**
    		 * Call when ClientTeamRole panel changed
    		 */
			$scope.panelStateChange = function(clientTeamRole){
				// Fetch all permissions tied to clientTeamRole
				ManageUserTeamRolesService.loadAllPermissions(clientTeamRole);
				// Fetch all teams tied to clientTeamRole
				UserClientUserClientTeamRolesService.getExistingTeams(clientTeamRole);
			};
			
			$scope.removeAllUserClientUserClientTeamRole = function(clientTeamRole){
				UserClientUserClientTeamRolesService.deleteAllUserClientUserClientTeamRole(clientTeamRole).then(function(response){
					
				});
			};
			
			/**
			 * Delete one UserClientUserClientTeamRole
			 */
			$scope.removeUserClientUserClientTeamRole = function(clientTeamRole, existingTeam){
				UserClientUserClientTeamRolesService.deleteUserClientUserClientTeamRole(existingTeam).then(function(response){
					UserClientUserClientTeamRolesService.getExistingTeams(clientTeamRole);
				});
			};
			
    		/**
    		 * @Unused
    		 * 
    		 * TODO: Disable client team roles if it's already existed
    		 * 
    		 */
    		$scope.disableClientTeamRoles = function(){
    			UserClientUserClientTeamRolesService.disableClientTeamRoles($scope.clientTeamRoles);
    		};
            
    		/**
	         * init method called when the page is loading
	         */
            function init(){
            	$controller('CommonSearch', {$scope: $scope});
            	$scope.client = Client.getClient();
                $scope.loadClientTeamRoles();
            }
            
            init();
        }
    ])
;
