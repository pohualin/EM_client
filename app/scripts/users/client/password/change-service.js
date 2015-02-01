'use strict';
angular.module('emmiManager')

/**
 * Service for change password
 */
    .service('UsersClientPasswordService', ['$http', 'UriTemplate', 'UsersClientService',
        function ($http, UriTemplate, UsersClientService) {
            var vowel = /[aeiouAEIOU]$/;
            var consonant = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]$/;
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
                 * Generate a password for the user.
                 *
                 * @param length of the password; defaults to 10
                 * @param memorable password for humans; defaults to true
                 * @param pattern used for recursion
                 * @param prefix used for recursion
                 * @returns {*}
                 */
                generatePassword: function (length, memorable, pattern, prefix) {
                    var char, n;
                    if (length === undefined || length === null) {
                        length = 10;
                    }
                    if (memorable === undefined || memorable === null) {
                        memorable = true;
                    }
                    if (pattern === undefined || pattern === null) {
                        pattern = /[a-zA-Z0-9]/;
                    }
                    if (prefix === undefined || prefix === null) {
                        prefix = "";
                    }
                    if (prefix.length >= length) {
                        return prefix;
                    }
                    if (memorable) {
                        if (prefix.match(consonant)) {
                            pattern = vowel;
                        } else {
                            pattern = consonant;
                        }
                    }
                    n = (Math.floor(Math.random() * 100) % 94) + 33;
                    char = String.fromCharCode(n);
                    if (memorable) {
                        char = char.toLowerCase();
                    }
                    if (!char.match(pattern)) {
                        return this.generatePassword(length, memorable, pattern, prefix);
                    }
                    return this.generatePassword(length, memorable, pattern, "" + prefix + char);
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
