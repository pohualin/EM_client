'use strict';

angular.module('emmiManager')

/**
 * This manages interactions when a user's credentials have expired.
 */
    .controller('CredentialsExpiredController', ['$scope', '$location', 'CredentialsExpiredService', 'credentials', 'client', '$alert',
        function ($scope, $location, CredentialsExpiredService, credentials, client, $alert) {

            /**
             * Set the component up in its initial state.
             */
            $scope.reset = function () {
                $scope.passwordChange = CredentialsExpiredService.createChangeHolder();
                $scope.changePasswordFormSubmitted = false;
            };

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
             * Load the password policy for display
             */
            CredentialsExpiredService.loadPolicy(client).then(function (response){
                $scope.policy = response.data;
            });

            /**
             * Saves a password change when the form is valid
             *
             * @param formValid true if the form is valid
             */
            $scope.save = function (changePasswordForm) {
                $scope.changePasswordFormSubmitted = true;
                changePasswordForm.password.$setValidity('policy', true);
                changePasswordForm.password.$setValidity('history', true);
                if (changePasswordForm.$valid) {
                    CredentialsExpiredService.expiredPassword(credentials, $scope.passwordChange)
                        .then(function success() {
                            $alert({
                                content: 'The password for <b>' + credentials.username +
                                '</b> has been successfully changed.',
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
                                $location.path('/credentials/expired/failure').replace();
                            }
                        });
                }
            };

            $scope.reset();
        }
    ])
;
