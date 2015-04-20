'use strict';

angular.module('emmiManager')
    .factory('LoginErrorMessageFactory', function () {
        this.reset = function () {
            this.showAccountActivationTokenExpired = false;
            this.showResetPasswordTokenExpired = false;
            this.showTemporaryPasswordTokenExpired = false;
            this.showEmailValidationTokenExpired = false;
            return this;
        };
        return this.reset();
    })
;
