'use strict';
angular.module('emmiManager')

/**
 * Service for change password
 */
    .service('CredentialsExpiredService', ['$http', 'UriTemplate', 'API','LoginErrorMessageFactory',
        function ($http, UriTemplate, api, LoginErrorMessageFactory) {
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
                        })
                        .error(function (response) {
                            if (response[0].entity.reason === 'EXPIRED_CANT_CHANGE'){
                                angular.extend(LoginErrorMessageFactory,{showTemporaryPasswordTokenExpired:true});
                            }
                            return response;
                        });
                },

                /**
                 * Loads the password policy for the client
                 */
                loadPolicy: function (client) {
                    return $http.get(UriTemplate.create(client.link.passwordPolicy).stringify())
                        .success(function (response) {
                            return response.data;
                        });
                }
            };
        }
    ])
;
