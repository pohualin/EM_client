'use strict';

angular.module('emmiManager')
    .controller('sendValidationEmail', ['$scope', 'ValidationService', '$alert', '$location', 'account', 'locationBeforeLogin',
        function ($scope, ValidationService, $alert, $location, account, locationBeforeLogin) {
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
             * functionality if user clicks not now
             */
            $scope.notNow = function () {
                $location.path(locationBeforeLogin).replace();
            };
        }])
;

