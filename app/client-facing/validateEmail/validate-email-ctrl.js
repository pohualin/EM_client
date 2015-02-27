'use strict';

angular.module('emmiManager')
    .controller('validateEmail', function ($scope, ValidationService, $alert) {
        /**
         * Send an activation email to the user
         */
        $scope.sendActivationEmail = function (isValid) {
            $scope.emailFormSubmitted = true;
            if(isValid) {
                ValidationService.sendValidationEmail($scope.account).then(function () {
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
            }

        };

        $scope.notNow = function () {
            ValidationService.notNow();
        }
    })
;

