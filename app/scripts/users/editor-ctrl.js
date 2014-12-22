'use strict';

angular.module('emmiManager')

/**
 *   Manage users
 */
    .controller('UsersEditorController', ['$alert', '$location', '$scope', 'UsersService',
        function ($alert, $location, $scope, UsersService) {
    	
            $scope.editMode = true;
	    	/**
	         * Called when 'Create Another User' is clicked
	         */
	        $scope.createAnotherUser = function () {
	        	$location.path('/users/new');
	        	$scope.createNewUser();
	        };
    	
	    	/**
	         * Called when 'Add New User' is clicked
	         */
	        $scope.createNewUser = function () {
	        	$scope.editMode = true;
	        	$scope.userFormSubmitted = false;
	        	$scope.useEmail = true;
	        	$scope.selectedUser = null;
	            $scope.userToBeEdit = UsersService.newUser();
	        };
	        
	        /**
	         * Called when 'edit' is clicked
	         */
	        $scope.edit = function () {
	            $scope.editMode = true;
	            $scope.userFormSubmitted = false;
	        };
	        
	        /**
	         * Called when Save button is clicked
	         */
    		$scope.save = function(isValid){
    			$scope.userFormSubmitted = true;
    			if (isValid) {
                    UsersService.createUser($scope.userToBeEdit).then(function(response){
                    	$scope.selectedUser = response.data;
                    	$scope.userToBeEdit = response.data;
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
    		$scope.toggleUseEmail = function(){
    			console.log('toggle ' + $scope.useEmail);
    			// $scope.useEmail = $scope.useEmail ? false : true;
    		};
    		
    		/**
	         * init method called when the page is loading
	         */
            function init(){
            	if(UsersService.getUser()){
            		// In this case User is already created
            		// Get the existing User
            		$scope.userToBeEdit = UsersService.getUser();
            		$scope.page.setTitle('View User - ' + $scope.userToBeEdit.firstName);
            	} else {
            		// In this case User does not exist
                    $scope.page.setTitle('Create User');
                    $scope.createNewUser();
            	}
            }
            
            init();
        }
    ])
;
