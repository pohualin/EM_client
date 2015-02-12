'use strict';

angular.module('emmiManager')

/**
 * This manages interactions when a user clicks an activation link
 */
    .controller('ResetClientUserPasswordController', ['$scope', '$location', 'ResetClientUserPasswordService', 'resetToken', '$alert',
        function ($scope, $location, ResetClientUserPasswordService, resetToken, $alert) {

            $scope.passwordChange = ResetClientUserPasswordService.createNewPasswordHolder();
            $scope.changePasswordFormSubmitted = false;

            /**
             * Compares the two password fields then sets a 'same' validity if the two passwords are identical
             */
            $scope.passwordChanged = function () {
                var passwordChange = $scope.passwordChange;
                $scope.changePasswordForm.confirmPassword.$setValidity('same', passwordChange.password === passwordChange.confirmPassword);
            };

            /**
             * Completes the reset
             */
            $scope.save = function (formValid) {
                $scope.changePasswordFormSubmitted = true;
                if (formValid) {
                    ResetClientUserPasswordService.reset(resetToken, $scope.passwordChange)
                        .then(function () {
                            $alert({
                                content: 'Your password has been reset. Please login.',
                                type: 'success',
                                placement: 'top',
                                show: true,
                                duration: 5,
                                dismissable: true
                            });
                            $location.path('/').replace();
                        }, function error() {
                            $location.path('/credentials/reset/failure').replace();
                        }
                    );
                }
            };
        }
    ])

;
