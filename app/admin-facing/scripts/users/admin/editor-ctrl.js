'use strict';

angular.module('emmiManager')

/**
 *   Manage users
 */
    .controller('UsersEditorController', ['$alert', '$location', '$scope', 'UsersService', '$popover',
        function ($alert, $location, $scope, UsersService, $popover) {

            $scope.edit = function () {
                $scope.userToBeEdit = angular.copy(UsersService.getUser());
                //because at this moment only one role can be selected
                if ($scope.userToBeEdit.roles && $scope.userToBeEdit.roles.length > 0) {
                    $scope.userToBeEdit.role = {};
                    $scope.userToBeEdit.role.entity = $scope.userToBeEdit.roles[0];
                }
                $scope.editMode = true;
            };

            $scope.cancel = function () {
                $scope.editMode = false;
                $scope.userFormSubmitted = false;
            };

            /**
             * Called when deactivate directive is used
             */
            $scope.makeActive = function () {
                $scope.userToBeEdit.active = true;
            };

            /**
             * Called when the x button is clicked in the popover
             */
            $scope.closePopover = function () {
                $scope.passwordNotification.$promise.then($scope.passwordNotification.destroy);
                delete $scope.passwordNotification;
            };

            /**
             * Generates a password for a user and saves it.
             */
            $scope.generatePassword = function ($event) {

                var newPassword = UsersService.generatePassword();
                $scope.selectedUser.password = newPassword;

                $scope.whenSaving = true;
                UsersService.savePassword($scope.selectedUser).then(function (response){

                    $scope.selectedUser = response.data;
                    $scope.selectedUser.password = newPassword;

                    $scope.passwordNotification = $popover(angular.element($event.currentTarget), {
                        scope: $scope,
                        placement: 'right',
                        trigger: 'manual',
                        templateUrl: 'admin-facing/partials/user/create/generate_api_popover.tpl.html',
                        show: true
                    });


                }).finally(function () {
                    $scope.whenSaving = false;
                });



            };


            /**
             * Called when Save button is clicked
             */
            $scope.save = function (userForm, addAnother) {
                $scope.userFormSubmitted = true;
                userForm.email.$setValidity('unique', true);
                if (userForm.$valid) {
                    var beforeSaveStatus = $scope.userToBeEdit.currentlyActive;
                    var formDirty = userForm.$dirty;
                    $scope.whenSaving = true;
                    UsersService.updateUser($scope.userToBeEdit).then(function (response) {
                        $scope.selectedUser = response.data;
                        $scope.userToBeEdit = response.data;
                        $scope.editMode = false;
                        userForm.$setPristine();
                        _paq.push(['trackEvent', 'Form Action', 'Emmi User Edit', 'Save']);
                        if (addAnother) {
                            $location.path('/users/new');
                        }
                        if ($scope.userToBeEdit.currentlyActive !== beforeSaveStatus) {
                            var message = 'User <b>' + $scope.userToBeEdit.login + '</b>';
                            // status has changed
                            if ($scope.userToBeEdit.currentlyActive) {
                                // now activated
                                message += ' is now active.';
                            } else {
                                // now deactivated
                                message += ' has been deactivated.';
                            }
                            $alert({
                                content: message
                            });
                        }

                        if (formDirty) {
                            $alert({
                                content: 'User <b>' + $scope.userToBeEdit.login + '</b> has been successfully updated.'
                            });
                        }

                        userForm.$setPristine();
                    }, function (error) {
                        if (error.status === 406) {
                            userForm.email.$setValidity('unique', false);
                            if (!$scope.errorAlert) {
                                $scope.errorAlert = $alert({
                                    content: 'Please correct the below information.',
                                    container: '#validation-container',
                                    type: 'danger',
                                    placement: '',
                                    duration: false,
                                    dismissable: false
                                });
                            }
                        }
                    }).finally(function () {
                        $scope.whenSaving = false;
                    });
                } else {
                    if (!$scope.errorAlert) {
                        $scope.errorAlert = $alert({
                            content: 'Please correct the below information.',
                            container: '#validation-container',
                            type: 'danger',
                            placement: '',
                            duration: false,
                            dismissable: false
                        });
                    }
                }
            };

            /**
             * init method called when the page is loading
             */
            function init() {
                $scope.selectedUser = UsersService.getUser();
                if ($scope.selectedUser) {
                    // In this case User is already created
                    // Get the existing User
                    $scope.userFormSubmitted = false;
                    UsersService.listUserAdminRoles().then(function (response) {
                        $scope.roles = response.content;
                    });

                    $scope.page.setTitle('View User - ' + $scope.selectedUser.firstName + ' ' + $scope.selectedUser.lastName + ' | ClientManager');
                } else {
                    // In this case User does not exist
                    $scope.page.setTitle('Create User | ClientManager');
                }
            }

            init();
        }
    ])
;
