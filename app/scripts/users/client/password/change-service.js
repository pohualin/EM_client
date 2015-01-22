'use strict';
angular.module('emmiManager')

/**
 * Service for change password
 */
    .service('UsersClientPasswordService', ['$http', 'UriTemplate', 'UsersClientService',
        function ($http, UriTemplate, UsersClientService) {
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
                 * @param userClient on which to change the password
                 * @param newPassword the new password object (same as createChangeHolder object)
                 * @returns the promise
                 */
                changePassword: function (userClient, newPassword) {
                    return $http.post(UriTemplate.create(userClient.link.changePassword).stringify(), newPassword)
                        .success(function (response) {
                            UsersClientService.setUserClient(userClient.entity.id);
                            return response;
                        });
                }
            };
        }
    ])
;
