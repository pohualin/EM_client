'use strict';
angular.module('emmiManager')

/**
 * Service for change password
 */
    .service('CredentialsExpiredService', ['$http', 'UriTemplate', 'API',
        function ($http, UriTemplate, api) {
            return {
                /**
                 * Create the object used on a form.
                 *
                 * @returns {{password: null, confirmPassword: null}}
                 */
                createChangeHolder: function () {
                    return {
                        password: null,
                        confirmPassword: null
                    };
                },

                /**
                 * Calls the backend changePassword link on the user client
                 *
                 * @param expiredCredentials on which to change the password
                 * @param newPassword the new password object (same as createChangeHolder object)
                 * @returns the promise
                 */
                expiredPassword: function (expiredCredentials, newPassword) {
                    return $http.post(UriTemplate.create(api.expiredPassword).stringify(), {
                        login: expiredCredentials.username,
                        existingPassword: expiredCredentials.password,
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
