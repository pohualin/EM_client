'use strict';

angular.module('emmiManager')

/**
 *   Manage users
 */
    .controller('UsersCreateController', ['$alert', '$scope', 'UsersService', '$location', '$popover', 'focus',
        function ($alert, $scope, UsersService, $location, $popover, $focus) {

            $scope.userToBeEdit = UsersService.newUser();
            
            UsersService.listUserAdminRoles().then(function (response) {
                $scope.roles = response.content;
            });

            /**
             * Called when Save button is clicked
             */
            $scope.save = function (isValid, event) {
                $scope.userFormSubmitted = true;
                if (isValid) {
                    UsersService.createUser($scope.userToBeEdit).then(function (response) {
                        // go to the view/edit page, if the save is successful
                        $location.path('/users/');
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

        }
    ])
;