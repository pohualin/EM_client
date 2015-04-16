'use strict';

angular.module('emmiManager')
    .factory('LoginErrorMessageFactory', function () {
        var showAccountActivationTokenExpired = false,
            showResetPasswordTokenExpired = false,
            showTemporaryPasswordTokenExpired = false,
            showEmailValidationTokenExpired = false;
        return this;
    })
;
