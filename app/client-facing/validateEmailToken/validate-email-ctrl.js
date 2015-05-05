'use strict';

angular.module('emmiManager')
    .controller('validateEmail', ['$scope', 'ValidationService', '$alert', '$location', 'validationKey',
        function ($scope, ValidationService, $alert, $location, validationKey) {

            /**
             * Validate email after a user clicks the link in their validation email
             */
            if (validationKey) {
                ValidationService.validateEmailToken(validationKey).then(function () {
                    //show confirmation banner
                    $alert({
                        content: 'Thanks! Your email address has been verified.',
                        type: 'success',
                        placement: 'top',
                        show: true,
                        duration: 5,
                        dismissable: true
                    });
                    $location.path('/login').replace();
                }, function error() {
                    $location.path('/login').replace();

                });

            }
        }])
;

