'use strict';

angular.module('emmiManager')

/**
 * Change password controller
 */
    .controller('UsersClientPasswordController', ['$scope', 'UsersClientService', 'UsersClientPasswordService', '$alert',
        function ($scope, UsersClientService, UsersClientPasswordService, $alert) {

            /**
             * Set the component up in its initial state.
             */
            $scope.reset = function () {
                $scope.passwordChange = UsersClientPasswordService.createChangeHolder();
                $scope.changePasswordFormSubmitted = false;
            };

            /**
             * Compares the two password fields then sets a 'same' validity if the two passwords are identical
             */
            $scope.passwordChanged = function () {
                var passwordChange = $scope.passwordChange;
                $scope.changePasswordForm.confirmPassword.$setValidity('same', passwordChange.password === passwordChange.confirmPassword);
            };

            /**
             * Saves a password change when the form is valid
             *
             * @param formValid true if the form is valid
             */
            $scope.save = function (formValid) {
                $scope.changePasswordFormSubmitted = true;
                if (formValid) {
                    UsersClientPasswordService.changePassword(UsersClientService.getUserClient(), $scope.passwordChange)
                        .then(function success() {
                            $scope.reset();
                            $alert({
                                content: 'The password for <b>' + UsersClientService.getUserClient().entity.login +
                                    '</b> has been successfully saved.',
                                type: 'success',
                                placement: 'top',
                                show: true,
                                duration: 5,
                                dismissable: true
                            });
                        }, function error() {
                            $scope.reset();
                        });
                }
            };

            $scope.reset();
        }
    ])
;

