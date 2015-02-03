'use strict';

angular.module('emmiManager')

/**
 *   Manage users
 */
    .controller('UsersEditorController', ['$alert', '$location', '$scope', 'UsersService',
        function ($alert, $location, $scope, UsersService) {

	        $scope.edit = function () {
                $scope.userToBeEdit = angular.copy(UsersService.getUser());
                //because at this moment only one role can be selected
                if ($scope.userToBeEdit.roles && $scope.userToBeEdit.roles.length > 0) {
                     $scope.userToBeEdit.role = {};
                    $scope.userToBeEdit.role.entity = $scope.userToBeEdit.roles[0];
                }

                $scope.editMode = true;
                $scope.userFormSubmitted = false;
                UsersService.listUserAdminRoles().then(function (response) {
                    $scope.roles = response.content;
                });
            };
	        /**
	         * Called when Save button is clicked
	         */
    		$scope.save = function(isValid, event, addAnother){
    			$scope.userFormSubmitted = true;
    			if (isValid) {
                    UsersService.updateUser($scope.userToBeEdit).then(function(response){
                    	$scope.selectedUser = response.data;
                    	$scope.userToBeEdit = response.data;
                    	$scope.editMode = false;
                    	_paq.push(['trackEvent', 'Form Action', 'Emmi User Edit', 'Save']);
                    	if(addAnother){
                    	    $location.path('/users/new');
                    	}
                    	window.paul = response;
                    	$alert({
                            content: 'User <b>' + response.data.login + '</b> has been successfully updated.',
                            type: 'success',
                            placement: 'top',
                            show: true,
                            duration: 5,
                            dismissable: true
                        });
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
                $scope.selectedUser = UsersService.getUser();
            	if($scope.selectedUser){
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
