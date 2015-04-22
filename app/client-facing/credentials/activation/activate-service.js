'use strict';
angular.module('emmiManager')

/**
 * Service for change password
 */
    .service('ActivateClientUserService', ['$http', 'UriTemplate', 'API','LoginErrorMessageFactory','$location',
        function ($http, UriTemplate, api, LoginErrorMessageFactory,$location) {
            return {
                /**
                 * Create the object used on the form.
                 *
                 * @returns {{password: null, confirmPassword: null}}
                 */
                createNewPasswordHolder: function () {
                    return {
                        password: null,
                        confirmPassword: null
                    };
                },

                /**
                 * Calls the backend activate link on the API
                 *
                 * @param activationToken the user's temporary auth
                 * @param newPassword the new password object (same as createChangeHolder object)
                 * @returns the promise
                 */
                activate: function (activationToken, newPassword) {
                    return $http.post(UriTemplate.create(api.activate).stringify(), {
                        activationToken: activationToken,
                        newPassword: newPassword.password
                    })
                        .success(function (response) {
                            return response;
                        })
                        .error(function (response) {
                            angular.extend(LoginErrorMessageFactory,{showAccountActivationTokenExpired:true});
                            return response;
                        });
                },

                 /**
                 * Calls the backend activate link on the API
                 *
                 * @param activationToken the user's temporary auth
                 * @returns the promise
                 */
                validateActivationToken: function (activationToken) {
                    return $http.get(UriTemplate.create(api.activate).stringify(), {
                        activationToken: activationToken
                    })
                    .success(function (response) {
                        return response;
                    })
                    .error(function (response) {
                        $location.path('/login').replace();
                        angular.extend(LoginErrorMessageFactory,{showAccountActivationTokenExpired:true});
                        return response;
                    });
                },

                /**
                 * Loads the password policy for the token
                 */
                loadPolicy: function (activationToken) {
                    return $http.get(UriTemplate.create(api.activationPasswordPolicy).stringify({
                        token: activationToken
                    })).success(function (response) {
                        return response.data;
                    });
                }
            };
        }
    ])
;
