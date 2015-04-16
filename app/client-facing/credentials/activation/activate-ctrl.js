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
             * Load the password policy for display
             */
            ActivateClientUserService.loadPolicy(activationCode).then(function (response){
                $scope.policy = response.data;
            });

            /**
             * Compares the two password fields then sets a 'same' validity if the two passwords are identical
             */
            $scope.passwordChanged = function () {
                var passwordChange = $scope.passwordChange;
                $scope.changePasswordForm.password.$setValidity('policy', true);
                $scope.changePasswordForm.password.$setValidity('history', true);
                $scope.changePasswordForm.confirmPassword.$setValidity('same', passwordChange.password === passwordChange.confirmPassword);
            };

            /**
             * Completes the activation
             */
            $scope.save = function (changePasswordForm) {
                $scope.changePasswordFormSubmitted = true;
                changePasswordForm.password.$setValidity('policy', true);
                changePasswordForm.password.$setValidity('history', true);
                if (changePasswordForm.$valid) {
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
                        }, function error(errorResponse) {
                            if (errorResponse.status === 406 && errorResponse.data) {
                                angular.forEach(errorResponse.data, function(validationError){
                                    if (validationError.entity.reason === 'POLICY') {
                                        changePasswordForm.password.$setValidity('policy', false);
                                    } else if (validationError.entity.reason === 'HISTORY') {
                                        changePasswordForm.password.$setValidity('history', false);
                                    }
                                });
                            } else {
                                $location.path('/login').replace();
                            }
                        }
                    );
                }
            };
        }
    ])

;
