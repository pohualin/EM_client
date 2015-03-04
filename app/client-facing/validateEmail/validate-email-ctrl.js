'use strict';

angular.module('emmiManager')
    .controller('validateEmail', ['$scope', 'ValidationService', '$alert', '$location','locationBeforeLogin',
        function ($scope, ValidationService, $alert, $location, locationBeforeLogin) {
            /**
             * Send an activation email to the user
             */
            $scope.sendActivationEmail = function () {
                ValidationService.sendValidationEmail($scope.account).then(function () {
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
            }

        };

        $scope.notNow = function () {
            ValidationService.notNow();
        };
    })
;

