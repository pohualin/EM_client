'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level users
 */
.controller('UsersClientUserClientRolesListController', ['$alert', '$location', '$scope', 'Client', 'ManageUserRolesService', 'UsersClientService', 'UserClientUserClientRolesService',
        function ($alert, $location, $scope, Client, ManageUserRolesService, UsersClientService, UserClientUserClientRolesService) {

			/**
    		 * Associate selected UserClientRole to selected UserClient
    		 */
    		$scope.associateClientRole = function (form) {
    			UserClientUserClientRolesService.associateUserClientUserClientRole($scope.selectedUserClient, form.selectedClientRole).then(function(){
    				$scope.loadExistingUserClientUserClientRoles();
    			});
    			_paq.push(['trackEvent', 'Form Action', 'User Client Role Edit', 'Add']);
    		};

	        /**
	         * Load existingUserClientUserClientRoles for the UserClient
	         */
	        $scope.loadExistingUserClientUserClientRoles = function(){
	            $scope.setLoading();
    			UserClientUserClientRolesService.
    			getUserClientUserClientRoles($scope.selectedUserClient).then(function(response){
    				// Set existingUserClientUserClientRoles if it exists
    				if(response.length > 0){
    					UserClientUserClientRolesService.loadPermissionsForUserClientUserClientRoles(response).then(function(response){
    						$scope.existingUserClientUserClientRoles = response;
    						$scope.setIsSuperUser();
    					});
                        // update parent controller with roles
                        $scope.setClientRoles(response);
    				} else {
    					// Load existing UserClientRoles for the Client
    					$scope.loadClientRoles();
    				}
    			});
    		};

            /**
    		 * load all UserClientRoles for the client
    		 */
    		$scope.loadClientRoles = function(){
				ManageUserRolesService.loadClientRolesWithPermissions().then(function(clientRoles){
					$scope.clientRoles = clientRoles;
					$scope.setIsSuperUser();
				});
    		};

            /**
	         * Called when 'remove' is clicked
	         */
	        $scope.removeUserClientRole = function (userClientUserClientRole) {
	            $scope.setLoading();
	        	UserClientUserClientRolesService.deleteUserClientUserClientRole(userClientUserClientRole)
	        	.then(function(){
	        		$scope.existingUserClientUserClientRoles = null;
                    // update parent controller with roles
                    $scope.setClientRoles(null);
	        		$scope.loadClientRoles();
	        	});
	        	_paq.push(['trackEvent', 'Form Action', 'User Client Role Edit', 'Remove']);
	        };

            /**
    		 * Called when UserClientUserClientRole panel is toggled
    		 */
    		$scope.toggleUserClientUserClienRolePanel = function(userClientUserClientRole){
                if (!userClientUserClientRole.activePanel || userClientUserClientRole.activePanel === 0) {
                    userClientUserClientRole.activePanel = 1;
                } else {
                    userClientUserClientRole.activePanel = 0;
                }
    			UserClientUserClientRolesService.loadPermissionsForExistingUserClientUserClientRole(userClientUserClientRole);
    		};

            /**
	         * init method called when the page is loading
	         */
            function init(){
        		// Check if there is an existed UserClientUserClientRole
        		$scope.loadExistingUserClientUserClientRoles();
            }

            init();
        }
    ])
;
