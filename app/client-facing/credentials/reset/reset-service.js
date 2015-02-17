'use strict';
angular.module('emmiManager')

/**
 * Service for change password
 */
    .service('ResetClientUserPasswordService', ['$http', 'UriTemplate', 'API',
        function ($http, UriTemplate, api) {
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
                 * Calls the backend reset password on the API
                 *
                 * @param resetToken the user's temporary reset token
                 * @param newPassword the new password object (same as createChangeHolder object)
                 * @returns the promise
                 */
                reset: function (resetToken, newPassword) {
                    return $http.put(UriTemplate.create(api.resetPassword).stringify(), {
                        resetToken: resetToken,
                        newPassword: newPassword.password
                    })
                        .success(function (response) {
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
