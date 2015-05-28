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

            $scope.cancel = function() {
                $location.path('/users');
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
                            content: 'User <b>' + response.data.login + '</b> has been successfully created.'
                        });
                    }, function (error) {
                        if (error.status === 406) {
                            // trigger email already taken validation
                            userForm.email.$setValidity('unique', false);
                            // store the taken email to compare against in our watcher
                            var alreadyTakenEmail = $scope.userToBeEdit.email;
                            // unwatch any previous email watcher
                            if ($scope.emailWatcher) { $scope.emailWatcher(); }
                            // setup a watch function on the email to monitor unique validation cases (EM-839)
                            $scope.emailWatcher = $scope.$watch('userToBeEdit.email', function(newValue) {
                                if (alreadyTakenEmail === newValue) {
                                    userForm.email.$setValidity('unique', false);
                                } else {
                                    userForm.email.$setValidity('unique', true);
                                }
                            });
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

            function init() {
                $scope.newEmmiUser();
            }

            init();
        }
    ])
;
