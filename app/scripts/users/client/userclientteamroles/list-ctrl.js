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
			};

            /**
			 * Remove all UserClientUserClientTeamRole
			 */
			$scope.removeAllUserClientUserClientTeamRole = function(clientTeamRole){
				UserClientUserClientTeamRolesService.deleteAllUserClientUserClientTeamRole(clientTeamRole).then(function(response){
					UserClientUserClientTeamRolesService.refreshTeamRoleCard(clientTeamRole);
				});
				_paq.push(['trackEvent', 'Form Action', 'User Client User Client Team Role Team', 'Remove All']);
			};

            /**
			 * Delete one UserClientUserClientTeamRole
			 */
			$scope.removeUserClientUserClientTeamRole = function(clientTeamRole, existingTeam){
				UserClientUserClientTeamRolesService.deleteUserClientUserClientTeamRole(existingTeam).then(function(response){
					UserClientUserClientTeamRolesService.refreshTeamRoleCard(clientTeamRole);
				});
				_paq.push(['trackEvent', 'Form Action', 'User Client User Client Team Role Team', 'Remove']);
			};

            /**
             * Toggle active/inactive panel
             */
            $scope.togglePanel = function (clientTeamRole) {
                if (!clientTeamRole.activePanel || clientTeamRole.activePanel === 0) {
                    clientTeamRole.activePanel = 1;
                } else {
                    clientTeamRole.activePanel = 0;
                }
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
