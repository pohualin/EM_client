'use strict';
angular.module('emmiManager')

/**
 * Service for activation.
 */
    .service('ValidationService', ['$http', 'UriTemplate', '$q', 'API',
        function ($http, UriTemplate, $q, API) {
            return {

                /**
                 * Sends an validation email to the UserClient
                 *
                 * @param user on which to send an email
                 * @returns the promise
                 */
                sendValidationEmail: function (user) {
                    var deferred = $q.defer();
                    $http.post(UriTemplate.create(user.link.sendValidationEmail).stringify(), user).then(function (response) {
                        deferred.resolve(response);
                    });
                    return deferred.promise;
                },

                /**
                 * validate an email
                 *
                 * @param user which has the email to validate
                 * @returns the promise
                 *
                 */
                validateEmail: function (user) {
                    var deferred = $q.defer();
                    $http.put(UriTemplate.create(user.link.self).stringify(), user)
                        .success(function (data, status, headers, config) {
                            deferred.resolve(data);
                        })
                        .error(function (msg, code) {
                            deferred.reject(msg);
                        });
                    return deferred.promise;

                },

                /**
                 * validate an email token
                 *
                 * @param emailValidationToken token to find user by
                 * @returns the promise
                 *
                 */
                validateEmailToken: function (emailValidationToken) {
                    var deferred = $q.defer();
                    $http.put(UriTemplate.create(API.validateEmailToken).stringify(), {validationToken: emailValidationToken}).then(function (response) {
                        deferred.resolve(response);
                    });
                    return deferred.promise;
                }


            };
        }
    ])
;
