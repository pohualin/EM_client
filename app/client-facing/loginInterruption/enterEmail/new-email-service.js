'use strict';
angular.module('emmiManager')

/**
 * Service for activation.
 */
    .service('NewEmailService', ['$http', 'UriTemplate', '$q',
        function ($http, UriTemplate, $q) {
            return {
                /**
                 * validate an email
                 *
                 * @param user which has the email to validate
                 * @param password user's password for security
                 * @returns the promise
                 *
                 */
                saveEmail: function (user,password) {
                    var deferred = $q.defer();
                    $http.put(UriTemplate.create(user.link.userClientEmail).stringify({password: password}), user)
                        .success(function (data) {
                            deferred.resolve(data);
                        })
                        .error(function (msg) {
                            deferred.reject(msg);
                        });
                    return deferred.promise;

                },

                /**
                 * dont ask user for information again until expiration date
                 *
                 * @param userClient current userClient
                 * @returns the response
                 *
                 */
                notNow: function (userClient) {
                    return $http.put(UriTemplate.create(userClient.link.notNow).stringify(), userClient).then(function (response) {
                        return response;
                    });
                }
            };
        }
    ])
;
