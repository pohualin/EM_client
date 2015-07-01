'use strict';

angular.module('emmiManager')

/**
 * This manages interactions when a user had forgotten his credentials.
 */
    .controller('CredentialsForgottenController', ['$scope', '$location', 'CredentialsForgottenService', '$alert',
        function ($scope, $location, CredentialsForgottenService, $alert) {

            $scope.emailAddress = '';

            /**
             * Sends a reset password
             */
            $scope.go = function () {
                $scope.resetPasswordForm.submitted = true;
                if ($scope.resetPasswordForm.$valid) {
                    $scope.whenSaving = true;
                    CredentialsForgottenService.resetPassword($scope.emailAddress).then(function () {
                        $alert({
                            content: 'An email has been sent to <strong>' + $scope.emailAddress +
                            '</strong> with instructions on how to reset your password.'
                        });

                    }).finally(function () {
                        $scope.whenSaving = false;
                        $location.path('/').replace();
                    });
                }
            };

        }
    ])
;
