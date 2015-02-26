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
             * Called when deactivate directive is used
             */
            $scope.makeActive = function(){
                $scope.userToBeEdit.active = true;
            };

	        /**
	         * Called when Save button is clicked
	         */
    		$scope.save = function(userForm, addAnother){
    			$scope.userFormSubmitted = true;
    			userForm.email.$setValidity('unique', true);
    			if (userForm.$valid) {
                    var beforeSaveStatus = $scope.userToBeEdit.currentlyActive;
                    var formDirty = userForm.$dirty;
                    UsersService.updateUser($scope.userToBeEdit).then(function(response){
                    	$scope.selectedUser = response.data;
                    	$scope.userToBeEdit = response.data;
                    	$scope.editMode = false;
                        var placement = 'top';
                        userForm.$setPristine();
                        _paq.push(['trackEvent', 'Form Action', 'Emmi User Edit', 'Save']);
                    	if(addAnother){
                    	    $location.path('/users/new');
                    	}
                        if ($scope.userToBeEdit.currentlyActive !== beforeSaveStatus){
                            var message = 'User <b>' + $scope.userToBeEdit.login + '</b>';
                            // status has changed
                            if ($scope.userToBeEdit.currentlyActive){
                                // now activated
                                message += ' is now active.';
                            } else {
                                // now deactivated
                                message += ' has been deactivated.';
                            }
                            $alert({
                                content: message,
                                type: 'success',
                                placement: placement,
                                show: true,
                                duration: 5,
                                dismissable: true
                            });
                            placement += ' second-line';
                        }

                        if (formDirty) {
                            $alert({
                                content: 'User <b>' + $scope.userToBeEdit.login + '</b> has been successfully updated.',
                                type: 'success',
                                placement: placement,
                                show: true,
                                duration: 5,
                                dismissable: true
                            });
                        }

                        userForm.$setPristine();
                    }, function (error) {
                        if (error.status === 406) {
                            userForm.email.$setValidity('unique', false);
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