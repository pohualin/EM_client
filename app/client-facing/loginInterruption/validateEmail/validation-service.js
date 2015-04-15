'use strict';
angular.module('emmiManager')

/**
 * Service for activation.
 */
    .service('ValidationService', ['$http', 'UriTemplate', '$q', 'API','LoginErrorMessageFactory',
        function ($http, UriTemplate, $q, API,LoginErrorMessageFactory) {
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
                saveEmail: function (user) {
                    var deferred = $q.defer();
                    if (user.email !== null && user.login !== null && user.login.toUpperCase() === user.originalUserClientEmail.toUpperCase()) {
                        user.login = user.email;
                    }
                    $http.put(UriTemplate.create(user.link.self).stringify(), user)
                        .success(function (data) {
                            deferred.resolve(data);
                        })
                        .error(function (msg) {
                            deferred.reject(msg);
                        });
                    return deferred.promise;

                },

                /**
                 * Get current userclient
                 * @param userClient
                 * @returns {*}
                 */
                get: function (userClient) {
                    return $http.get(userClient.link.self).then(function (response) {
                        response.data.originalUserClientEmail = response.data.email;
                        return response.data;
                    });
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
                    $http.put(UriTemplate.create(API.validateEmailToken).stringify(), {validationToken: emailValidationToken})
                        .success(function(response) {
                            deferred.resolve(response);
                        })
                        .error(function (response) {
                            angular.extend(LoginErrorMessageFactory,{showEmailValidationTokenExpired:true});
                            deferred.resolve(response);
                        });
                    return deferred.promise;
                },

                /**
                 * dont ask user for information again until expiration date
                 *
                 * @param userClient current userClient
                 * @returns the response
                 *
                 **/
                notNow: function (userClient) {
                    $http.put(UriTemplate.create(userClient.link.notNow).stringify(), userClient).then(function (response) {
                        return response;
                    });
                }


            };
        }
    ])
;
