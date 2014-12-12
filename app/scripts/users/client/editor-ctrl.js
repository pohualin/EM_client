'use strict';

angular.module('emmiManager')

/**
 *   Manage Client Level users
 */
    .controller('ClientUsersEditorCtrl', ['$alert', '$scope', 'Client', 'ClientUsersService', 'ManageUserTeamRolesService',
        function ($alert, $scope, Client, ClientUsersService, ManageUserTeamRolesService) {
	    	/**
	         * Called when 'Create Another User' is clicked
	         */
	        $scope.createAnotherClientUser = function () {
	        	$scope.clientUserFormSubmitted = false;
	        	$scope.createdClientUser = null;
	        	$scope.createNewClientUser();
	        };
    	
	    	/**
	         * Called when 'Add New User' is clicked
	         */
	        $scope.createNewClientUser = function () {
	        	$scope.editMode = true;
	            $scope.clientUserToBeEdit = ClientUsersService.newClientUser();
	            focus('firstName');
	        };
	        
	        /**
	         * Called when 'edit' is clicked
	         */
	        $scope.edit = function () {
	            $scope.editMode = true;
	            $scope.clientUserFormSubmitted = false;
	            focus('firstName');
	        };
    	
	        /**
	         * Called when Save button is clicked
	         */
    		$scope.save = function(isValid){
    			$scope.clientUserFormSubmitted = true;
    			if (isValid) {
                    ClientUsersService.createClientUser($scope.client, $scope.clientUserToBeEdit.entity).then(function(response){
                    	console.log('back from create');
                    	$scope.createdClientUser = response.data;
                    	$scope.clientUserToBeEdit = response.data;
                    	$scope.editMode = false;
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
	         * Called when Use Email checked box is toggled
	         */
    		$scope.toggleUseEmail = function(input){
    			console.log('toggle ' + $scope.useEmail);
    			// $scope.useEmail = $scope.useEmail ? false : true;
    		};
    		
    		/**
    		 * load all UserClientTeamRoles for the client
    		 */
    		$scope.loadClientTeamRoles = function(){
    			ManageUserTeamRolesService.loadClientTeamRoles().then(function(clientTeamRoles){
					$scope.clientTeamRoles = clientTeamRoles;
				});
    		};
    		
    		/**
    		 * Load permissions for an existing ClientTeamRole
    		 */
    		$scope.toggleClientTeamRoleCaret = function(clientTeamRole){
    			ManageUserTeamRolesService.loadAllPermissions(clientTeamRole);
    		};
            
            function init(){
            	$scope.client = Client.getClient();
            	$scope.useEmail = true;
                $scope.page.setTitle('Create Users - ' + $scope.client.entity.name);
                $scope.createNewClientUser();
                $scope.loadClientTeamRoles();
            }
            
            init();
        }
    ])
;
