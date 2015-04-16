'use strict';
angular.module('emmiManager')

/**
 * Service for change password
 */
    .service('ResetClientUserPasswordService', ['$http', 'UriTemplate', 'API','LoginErrorMessageFactory',
        function ($http, UriTemplate, api,LoginErrorMessageFactory) {
            return {
                /**
                 * Create the object used on the form.
                 *
                 * @returns {{password: null, confirmPassword: null}}
                 */
                createNewPasswordHolder: function () {
                    return {
                        password: null,
                        confirmPassword: null
                    };
                },

                /**
                 * Calls the back end reset password on the API
                 *
                 * @param resetToken the user's temporary reset token
                 * @param newPassword the new password object
                 * @param userClientSecretQuestionResponse user enter security responses
                 * @returns the promise
                 */
                reset: function (resetToken, newPassword, userClientSecretQuestionResponse) {
                    return $http.put(UriTemplate.create(api.resetPassword).stringify(), {
                        resetToken: resetToken,
                        newPassword: newPassword.password,
                        userClientSecretQuestionResponse: userClientSecretQuestionResponse
                    })
                        .success(function (response) {
                            return response;
                        })
                        .error(function (response) {
                            angular.extend(LoginErrorMessageFactory,{showResetPasswordTokenExpired:true});
                            return response;
                        });
                },

                /**
                 * Calls the back end to locked out a user with reset password token
                 * @param resetToken
                 * @returns userClient
                 */
                lockedOutUserByResetToken: function (resetToken) {
                    return $http.put(UriTemplate.create(api.lockedOutUserByResetToken).stringify({token: resetToken}))
                        .then(function (response) {
                            return response;
                        });
                },


                /**
                 * Loads the password policy for the token
                 */
                loadPolicy: function (resetToken) {
                    return $http.get(UriTemplate.create(api.resetPasswordPolicy).stringify({
                        token: resetToken
                    })).success(function (response) {
                        return response.data;
                    });
                }
            };
        }
    ])
;
