'use strict';

angular.module('emmiManager')

/**
 *   Manage users
 */
    .controller('UsersCreateController', ['$alert', '$scope', 'UsersService', '$location', '$popover', 'focus',
        function ($alert, $scope, UsersService, $location, $popover, $focus) {

            $scope.newEmmiUser = function(){
                $scope.userToBeEdit = UsersService.newUser();
                UsersService.listUserAdminRoles().then(function (response) {
                    $scope.roles = response.content;
                    $scope.userToBeEdit.role = {};
                    $scope.userToBeEdit.role.entity = UsersService.getDefaultRole($scope.roles);
                });
            };

            /**
             * Called when Save button is clicked
             */
            $scope.save = function (userForm, addAnother) {
                $scope.userFormSubmitted = true;
                userForm.email.$setValidity('unique', true);
                if (userForm.$valid) {
                    UsersService.createUser($scope.userToBeEdit).then(function (response) {
                        // go to the view/edit page, if the save is successful
                        _paq.push(['trackEvent', 'Form Action', 'Create Emmi User', 'Save']);
                        if(!addAnother){
                            $location.path('/users/');
                        } else {
                            $location.path('/users/new');
                            $scope.userFormSubmitted = false;
                            $scope.newEmmiUser();
                        }
                        $alert({
                            content: 'User <b>' + response.data.login + '</b> has been successfully created.',
                            type: 'success',
                            placement: 'top',
                            show: true,
                            duration: 5,
                            dismissable: true
                        });
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

            function init() {
                $scope.newEmmiUser();
            }

            init();
        }
    ])
;
