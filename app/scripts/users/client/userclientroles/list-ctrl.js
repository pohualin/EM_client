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
    		};
    	
	        /**
	         * Load existingUserClientUserClientRoles for the UserClient
	         */
	        $scope.loadExistingUserClientUserClientRoles = function(){
    			UserClientUserClientRolesService.
    			getUserClientUserClientRoles($scope.selectedUserClient).then(function(response){
    				// Set existingUserClientUserClientRoles if it exists
    				if(response.length > 0){
    					UserClientUserClientRolesService.loadPermissionsForUserClientUserClientRoles(response).then(function(response){
    						$scope.existingUserClientUserClientRoles = response;
        					$scope.$parent.$parent.isSuperUser = UserClientUserClientRolesService.isSuperUser();
    					});
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
				});
    		};
    	
	        /**
	         * Called when 'remove' is clicked
	         */
	        $scope.removeUserClientRole = function (userClientUserClientRole) {
	        	UserClientUserClientRolesService.deleteUserClientUserClientRole(userClientUserClientRole)
	        	.then(function(response){
	        		$scope.existingUserClientUserClientRoles = null;
	        		$scope.$parent.$parent.isSuperUser = false;
	        		$scope.loadClientRoles();
	        	});
	        };
    		
    		/**
    		 * Called when UserClientUserClientRole panel is toggled
    		 */
    		$scope.toggleUserClientUserClienRolePanel = function(userClientUserClientRole){
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
