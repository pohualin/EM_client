'use strict';
angular.module('emmiManager')

/**
 * Service for change password
 */
    .service('ChangePasswordService', ['$http', 'UriTemplate', 'API', 'moment',
        function ($http, UriTemplate, api, moment) {
            return {

                /**
                 * Create an ChangePasswordRequest place holder
                 */
                createChangeHolder: function () {
                    return {
                        oldPassword: null,
                        password: null,
                        confirmPassword: null
                    };
                },

                /**
                 * Call server side to verify old password, validate new password pattern and save new password
                 */
                changePassword: function(account, passwordChange){
                    return $http.post(UriTemplate.create(account.link.changePassword).stringify(), {
                        login: account.login,
                        existingPassword: passwordChange.oldPassword,
                        newPassword: passwordChange.password
                    }, {override403: true}).success(function (response) {
                            return response;
                        });
                },

                /**
                 * See if UserClient is eligible for changing password
                 */
                eligibleToChange: function (policy, account) {
                    if(!account.passwordSavedTime){
                        return true;
                    }
                    return (moment().diff(moment(account.passwordSavedTime), 'days') - policy.daysBetweenPasswordChange) > -1;
                },

                /**
                 * Load Client password policy to use
                 */
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
