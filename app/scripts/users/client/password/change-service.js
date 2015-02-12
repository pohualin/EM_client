'use strict';
angular.module('emmiManager')

/**
 * Service for change password
 */
    .service('UsersClientPasswordService', ['$http', 'UriTemplate', 'UsersClientService', '$q',
        function ($http, UriTemplate, UsersClientService, $q) {
            var vowel = /[aeiouAEIOU]$/;
            var consonant = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]$/;
            var number = /[2-9]$/;
            var special = /[!@#$%]$/;
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
                 * Generate a password for the user. Plus adds a number
                 * and special
                 *
                 *
                 * @param length of the password + 2 extra; defaults to 6 + 2
                 * @param memorable password for humans; defaults to true
                 * @param pattern used for recursion
                 * @param prefix used for recursion
                 * @returns {*}
                 */
                generatePassword: function (length, memorable, pattern, prefix) {
                    var char, n;
                    if (length === undefined || length === null) {
                        length = 6;
                    }
                    if (memorable === undefined || memorable === null) {
                        memorable = true;
                    }
                    if (pattern === undefined || pattern === null) {
                        pattern = /[a-zA-Z0-9]/;
                    }
                    if (prefix === undefined || prefix === null) {
                        prefix = '';
                    }
                    if (prefix.length >= length) {
                        memorable = false;
                        if (prefix.length - 2 !== length) {
                            // add a special character and number to the end
                            if (prefix.length - 1 === length) {
                                // last char is a special
                                pattern = special;
                            } else {
                                // second to last is number
                                pattern = number;
                            }
                        } else {
                            return prefix;
                        }
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
                    return this.generatePassword(length, memorable, pattern, '' + prefix + char);
                },

                /**
                 * Sends an activation email to the UserClient
                 *
                 * @param userClient on which to send an email
                 * @returns the promise
                 */
                sendReset: function (userClient) {
                    var deferred = $q.defer();
                    $http.get(UriTemplate.create(userClient.link.resetPassword).stringify())
                        .success(function (response) {
                            UsersClientService.setUserClient(userClient.entity.id).then(function reloaded() {
                                deferred.resolve(response);
                            }, function error() {
                                deferred.reject();
                            });
                        }).error(function error() {
                            deferred.reject();
                        });
                    return deferred.promise;
                },

                /**
                 * Deletes the reset tokens on the client immediately
                 *
                 * @param userClient on which to send
                 * @returns {*}
                 */
                expireReset: function (userClient) {
                    var deferred = $q.defer();
                    $http.delete(UriTemplate.create(userClient.link.resetPassword).stringify())
                        .success(function (response) {
                            UsersClientService.setUserClient(userClient.entity.id).then(function reloaded() {
                                deferred.resolve(response);
                            }, function error() {
                                deferred.reject();
                            });
                        }).error(function error() {
                            deferred.reject();
                        });
                    return deferred.promise;
                },

                /**
                 * Calls the backend changePassword link on the user client
                 *
                 * @param userClient on which to change the password
                 * @param newPassword the new password object (same as createChangeHolder object)
                 * @returns the promise
                 */
                changePassword: function (userClient, newPassword) {
                    var deferred = $q.defer();
                    $http.post(UriTemplate.create(userClient.link.changePassword).stringify(), newPassword)
                        .success(function (response) {
                            UsersClientService.setUserClient(userClient.entity.id).then(function reloaded() {
                                deferred.resolve(response);
                            }, function error() {
                                deferred.reject();
                            });
                        })
                        .error(function error() {
                            deferred.reject();
                        });
                    return deferred.promise;
                }
            };
        }
    ])
;
