'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level users
 */
    .controller('UsersClientEditorController', ['$alert', '$location', '$scope', 'Client', 'ManageUserRolesService', 'UsersClientService', 'UserClientUserClientRolesService',
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
	         * Called when 'Create Another User' is clicked
	         */
	        $scope.createAnotherUserClient = function () {
	        	$location.path('/clients/' + $scope.client.entity.id + '/users/new');
	        	$scope.createNewUserClient();
	        };
    	
	    	/**
	         * Called when 'Add New User' is clicked
	         */
	        $scope.createNewUserClient = function () {
	        	$scope.editMode = true;
	        	$scope.userClientFormSubmitted = false;
	        	$scope.useEmail = true;
	        	$scope.selectedUserClient = null;
	        	$scope.existingUserClientUserClientRoles = null;
	            $scope.userClientToBeEdit = UsersClientService.newUserClient();
	        };
	        
	        /**
	         * Called when 'edit' is clicked
	         */
	        $scope.edit = function () {
	            $scope.editMode = true;
	            $scope.page.setTitle('Edit User - ' + $scope.client.entity.name);
	            $scope.userClientFormSubmitted = false;
	        };
	        
	        /**
	         * Load existingUserClientUserClientRoles for the UserClient
	         */
	        $scope.loadExistingUserClientUserClientRoles = function(){
    			UserClientUserClientRolesService.
    			getUserClientUserClientRoles($scope.selectedUserClient).then(function(response){
    				// Set existingUserClientUserClientRoles if it exists
    				if(response.length > 0){
    					$scope.existingUserClientUserClientRoles = response;	
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
	        		$scope.loadClientRoles();
	        	});
	        };
	        
	        /**
	         * Called when Save button is clicked
	         */
    		$scope.save = function(isValid){
    			$scope.userClientFormSubmitted = true;
    			if (isValid) {
                    UsersClientService.createUserClient($scope.client, $scope.userClientToBeEdit.entity).then(function(response){
                    	$scope.selectedUserClient = response.data;
                    	$scope.userClientToBeEdit = response.data;
                    	$scope.editMode = false;
                    	$scope.loadClientRoles();
                    });
                } else {
                    if (!$scope.errorAlert) {
                        $scope.errorAlert = $alert({
                            title: ' ',
                            content: 'Please correct the below information.',
                            container: '#message-container',
                            type: 'danger',
                            show: true,
                            dismissable: false
                        });
                    }
                }
    		};
    		
    		/**
    		 * Called when UserClientUserClientRole panel is toggled
    		 */
    		$scope.toggleUserClientUserClienRolePanel = function(userClientUserClientRole){
    			UserClientUserClientRolesService.loadPermissionsForExistingUserClientUserClientRole(userClientUserClientRole);
    		};
    		
    		/**
	         * Called when Use Email checked box is toggled
	         */
    		$scope.toggleUseEmail = function(){
    			console.log('toggle ' + $scope.useEmail);
    			// $scope.useEmail = $scope.useEmail ? false : true;
    		};
    		
    		/**
	         * init method called when the page is loading
	         */
            function init(){
            	$scope.client = Client.getClient();
            	if(UsersClientService.getUserClient()){
            		// In this case UserClient is already created
            		// Get the existing UserClient
            		$scope.selectedUserClient = UsersClientService.getUserClient();
            		$scope.page.setTitle('View User - ' + $scope.client.entity.name);
            		// Check if there is an existed UserClientUserClientRole
            		$scope.loadExistingUserClientUserClientRoles();
            	} else {
            		// In this case UserClient does not exist
                    $scope.page.setTitle('Create User - ' + $scope.client.entity.name);
                    $scope.createNewUserClient();
            	}
            }
            
            init();
        }
    ])
;
