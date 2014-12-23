'use strict';

angular.module('emmiManager')

/**
 *   Manage users
 */
    .controller('UsersEditorController', ['$alert', '$location', '$scope', 'UsersService',
        function ($alert, $location, $scope, UsersService) {

	        $scope.edit = function () {
                $scope.userToBeEdit = angular.copy(UsersService.getUser());
                $scope.editMode = true;
                $scope.userFormSubmitted = false;
                UsersService.listUserAdminRoles().then(function (response) {
                    $scope.roles = response.content;
                });
            };
	        /**
	         * Called when Save button is clicked
	         */
    		$scope.save = function(isValid){
    			$scope.userFormSubmitted = true;
    			if (isValid) {
                    UsersService.updateUser($scope.userToBeEdit).then(function(response){
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
	         * init method called when the page is loading
	         */
            function init(){
            	if(UsersService.getUser()){
            		// In this case User is already created
            		// Get the existing User
            		$scope.edit();
            		$scope.page.setTitle('View User - ' + $scope.userToBeEdit.firstName);
            	} else {
            		// In this case User does not exist
                    $scope.page.setTitle('Create User');
            	}
            }
            
            init();
        }
    ])
;
