'use strict';

angular.module('emmiManager')

/**
 * This manages interactions when a user clicks an activation link
 */
    .controller('ActivateClientUserController', ['$scope', '$location', 'ActivateClientUserService', 'activationCode', '$alert',
        function ($scope, $location, ActivateClientUserService, activationCode, $alert) {

            $scope.passwordChange = ActivateClientUserService.createNewPasswordHolder();
            $scope.changePasswordFormSubmitted = false;

            /**
             * Compares the two password fields then sets a 'same' validity if the two passwords are identical
             */
            $scope.passwordChanged = function () {
                var passwordChange = $scope.passwordChange;
                $scope.changePasswordForm.confirmPassword.$setValidity('same', passwordChange.password === passwordChange.confirmPassword);
            };

            /**
             * Completes the activation
             */
            $scope.save = function (formValid) {
                $scope.changePasswordFormSubmitted = true;
                if (formValid) {
                    ActivateClientUserService.activate(activationCode, $scope.passwordChange)
                        .then(function () {
                            $alert({
                                content: 'Your account has been activated. Please login.',
                                type: 'success',
                                placement: 'top',
                                show: true,
                                duration: 5,
                                dismissable: true
                            });
                            $location.path('/').replace();
                        }, function error() {
                            $location.path('/credentials/activation/failure').replace();
                        }
                    );
                }
            };
        }
    ])

;
