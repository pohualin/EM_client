'use strict';
angular.module('emmiManager')

/**
 * Service for change password
 */
    .service('CredentialsResetService', ['$http', 'UriTemplate', 'API',
        function ($http, UriTemplate, api) {
            return {

                createChangeHolder: function () {
                    return {
                        oldPassword: null,
                        password: null,
                        confirmPassword: null
                    };
                },

                expiredPassword: function (expiredCredentials, newPassword) {
                    return $http.post(UriTemplate.create(api.expiredPassword).stringify(), {
                        login: expiredCredentials.username,
                        existingPassword: expiredCredentials.password,
                        newPassword: newPassword.password
                    })
                        .success(function (response) {
                            return response;
                        });
                },

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
