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
                 * Calls the backend activate link on the API
                 *
                 * @param resetToken the user's temporary auth
                 * @param newPassword the new password object (same as createChangeHolder object)
                 * @returns the promise
                 */
                reset: function (resetToken, newPassword) {
                    return $http.put(UriTemplate.create(api.reset_password).stringify(), {
                        resetToken: resetToken,
                        newPassword: newPassword.password
                    })
                        .success(function (response) {
                            return response;
                        });
                }
            };
        }
    ])
;
