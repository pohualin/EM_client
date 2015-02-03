'use strict';
angular.module('emmiManager')

/**
 * Service for activation.
 */
    .service('ActivationService', ['$http', 'UriTemplate', 'UsersClientService',
        function ($http, UriTemplate, UsersClientService) {
            return {

                /**
                 * Sends an activation email to the UserClient
                 *
                 * @param userClient on which to send an email
                 * @returns the promise
                 */
                sendActivationEmail: function (userClient) {
                    return $http.get(UriTemplate.create(userClient.link.activate).stringify())
                        .success(function (response) {
                            UsersClientService.setUserClient(userClient.entity.id);
                            return response;
                        });
                }
            };
        }
    ])
;
