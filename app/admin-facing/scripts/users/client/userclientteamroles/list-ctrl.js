'use strict';

angular.module('emmiManager')

/**
 * Controller for list of UserClientUserClientTeamRole
 */
    .controller('UsersClientUserClientTeamRolesListController',
		['$controller', '$scope', 'Client', 'TeamsFilter', 'ManageUserTeamRolesService', 'UsersClientService', 'UserClientUserClientRolesService', 'UserClientUserClientTeamRolesService',
        function ($controller, $scope, Client, TeamsFilter, ManageUserTeamRolesService, UsersClientService, UserClientUserClientRolesService, UserClientUserClientTeamRolesService) {

            $scope.userClientUserClientRolesService = UserClientUserClientRolesService;

			/**
    		 * load all UserClientTeamRoles for the client
    		 */
    		$scope.loadClientTeamRoles = function(){
    			ManageUserTeamRolesService.loadClientTeamRoles(Client.getClient()).then(function(clientTeamRoles){
					$scope.clientTeamRoles = clientTeamRoles;
					UserClientUserClientTeamRolesService.refreshTeamRoleCards($scope.clientTeamRoles);
                    // update parent controller with roles
                    $scope.setTeamRoles(clientTeamRoles);
				});
    		};

            /**
    		 * Called when ClientTeamRole panel changed
    		 */
			$scope.panelStateChange = function(clientTeamRole){
				// Fetch all permissions tied to clientTeamRole if panel is open
                if (clientTeamRole.activePanel !== 0) { // this fires before bs-collapse
				    ManageUserTeamRolesService.loadAllPermissions(clientTeamRole);
                }
			};

            /**
			 * Remove all UserClientUserClientTeamRole
			 */
			$scope.removeAllUserClientUserClientTeamRole = function(clientTeamRole){
                UserClientUserClientTeamRolesService.deleteAllUserClientUserClientTeamRole(clientTeamRole).then(function () {
					UserClientUserClientTeamRolesService.refreshTeamRoleCard(clientTeamRole);
				});
				_paq.push(['trackEvent', 'Form Action', 'User Team Role Team', 'Remove All']);
			};

            /**
			 * Delete one UserClientUserClientTeamRole
			 */
			$scope.removeUserClientUserClientTeamRole = function(clientTeamRole, existingTeam){
                UserClientUserClientTeamRolesService.deleteUserClientUserClientTeamRole(existingTeam).then(function () {
					UserClientUserClientTeamRolesService.refreshTeamRoleCard(clientTeamRole);
				});
				_paq.push(['trackEvent', 'Form Action', 'User Team Role Team', 'Remove']);
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
