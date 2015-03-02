'use strict';
angular.module('emmiManager')

/**
 * Service for activation.
 */
    .service('ValidationService', ['$http', 'UriTemplate', '$q', '$location',
        function ($http, UriTemplate, $q, $location) {
            return {

                /**
                 * Sends an activation email to the UserClient
                 *
                 * @param user on which to send an email
                 * @returns the promise
                 */
                sendValidationEmail: function (user) {
                    var deferred = $q.defer();
                    $http.post(UriTemplate.create(user.link.validate).stringify(),user).then(function(response) {
                        $location.path('#/');
                        deferred.resolve(response);
                    });
                    return deferred.promise;
                },

                /**
                 * not now functionality
                 *
                 */
                notNow: function () {
                        $location.path('/');
                }


            };
        }
    ])
;
