'use strict';
angular.module('emmiManager')

/**
 * Service for activation.
 */
    .service('ActivationService', ['$http', 'UriTemplate', 'UsersClientService', '$q',
        function ($http, UriTemplate, UsersClientService, $q) {
            return {

                /**
                 * Sends an activation email to the UserClient
                 *
                 * @param userClient on which to send an email
                 * @returns the promise
                 */
                sendActivationEmail: function (userClient) {
                    var deferred = $q.defer();
                    $http.get(UriTemplate.create(userClient.link.activate).stringify())
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
                 * Expires an activation email
                 *
                 * @param userClient on which to expire
                 * @returns {*}
                 */
                expireActivation: function (userClient) {
                    var deferred = $q.defer();
                    $http.delete(UriTemplate.create(userClient.link.activate).stringify())
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
                }

            };
        }
    ])
;
