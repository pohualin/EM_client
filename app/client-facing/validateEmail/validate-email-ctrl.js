'use strict';

angular.module('emmiManager')
    .controller('validateEmail', ['$scope', 'ValidationService', '$alert', '$location', 'account', 'locationBeforeLogin', 'validationKey',
        function ($scope, ValidationService, $alert, $location, account, locationBeforeLogin, validationKey) {
            /**
             * Send a validation email to the user
             */
            $scope.sendActivationEmail = function () {
                ValidationService.sendValidationEmail(account).then(function () {
                    $location.path(locationBeforeLogin).replace();
                    //show confirmation banner
                    $alert({
                        content: 'Please check your email. A link has been sent to <strong>' + $scope.account.email +
                            '</strong> to finish setting up your account.',
                        type: 'success',
                        placement: 'top',
                        show: true,
                        duration: 5,
                        dismissable: true
                    });
                });
            };

            /**
             * Validate email after a user clicks the link in their validation email
             */
            $scope.validateEmail = function () {
                if (validationKey) {
                    ValidationService.validateEmail(validationKey).then(function () {
                        //show confirmation banner
                        $alert({
                            content: 'Thanks! Your email address has been verified.',
                            type: 'success',
                            placement: 'top',
                            show: true,
                            duration: 5,
                            dismissable: true
                        });
                    });
                }
            };
            $scope.validateEmail();

            /**
             * functionality if user clicks not now
             */
            $scope.notNow = function () {
                $location.path(locationBeforeLogin).replace();
            };
        }])
;

