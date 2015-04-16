'use strict';
angular.module('emmiManager')

/**
 * Service for forgotten passwords
 */
    .service('CredentialsForgottenService', ['$http', 'UriTemplate', 'API',
        function ($http, UriTemplate, api) {
            return {

                /**
                 * Calls the backend forgotPassword link
                 *
                 * @param emailAddress on which to send the password reset
                 * @returns the promise
                 */
                resetPassword: function (emailAddress) {
                    return $http.put(UriTemplate.create(api.forgotPassword).stringify(), {
                        email: emailAddress
                    }).success(function (response) {
                            return response;
                        });
                }
            };
        }
    ])
;
