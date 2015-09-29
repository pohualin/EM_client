'use strict';

angular.module('emmiManager')
    .controller('validateEmail', ['$scope', 'ValidationService', '$alert', '$location', 'validationKey',
        'trackingToken',
        function ($scope, ValidationService, $alert, $location, validationKey, trackingToken) {

            /**
             * Validate email after a user clicks the link in their validation email
             */
            if (validationKey) {
                ValidationService.validateEmailToken(validationKey, trackingToken).then(function () {
                    //show confirmation banner
                    $alert({
                        content: 'Thanks! Your email address has been verified.'
                    });
                    $location.path('/login').replace();
                }, function error(err) {
                    if (err.status === 403) {
                        $location.path('/unauthorized').replace();
                    } else {
                        $location.path('/login').replace();
                    }

                });

            }
        }])
;

