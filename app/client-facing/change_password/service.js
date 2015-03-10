'use strict';
angular.module('emmiManager')

/**
 * Service for change password
 */
    .service('ChangePasswordService', ['$http', 'UriTemplate', 'API',
        function ($http, UriTemplate, api) {
            return {

                createChangeHolder: function () {
                    return {
                        oldPassword: null,
                        password: null,
                        confirmPassword: null
                    };
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
