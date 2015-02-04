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
            $scope.save = function (isValid, event, addAnother) {
                $scope.userFormSubmitted = true;
                if (isValid) {
                    UsersService.createUser($scope.userToBeEdit).then(function (response) {
                        // go to the view/edit page, if the save is successful
                        _paq.push(['trackEvent', 'Form Action', 'Create Emmi User', 'Save']);
                        if(!addAnother){
                            $location.path('/users/');
                        } else {
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
                        if (error.status === 409) {
                            // 409 is http conflict, meaning save was prevented due to conflicts with other users
                            $scope.conflictingUsers = error.data.conflicts;
                            $popover(angular.element(event.currentTarget), {
                                title: '',
                                placement: 'left',
                                scope: $scope,
                                trigger: 'manual',
                                autoClose: true,
                                show: true,
                                template: 'partials/user/create/user_already_exists_popover.tpl.html'
                            });
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
