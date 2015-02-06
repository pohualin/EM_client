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
                CredentialsForgottenService.resetPassword($scope.emailAddress).then(function () {
                    $alert({
                        content: 'An email has been sent to <strong>' + $scope.emailAddress +
                        '</strong> with instructions on how to reset your password.',
                        type: 'success',
                        placement: 'top',
                        show: true,
                        duration: 5,
                        dismissable: true
                    });

                }).finally(function () {
                    $location.path('/').replace();
                });
            };

        }
    ])
;
