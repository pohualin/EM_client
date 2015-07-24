(function (angular) {

    'use strict';
    angular.module('emmiManager')

    /**
     * This service is responsible fetch operations for program resources
     */
        .service('PatientSupportViewProgramHistoryService', ['$q', '$http', 'UriTemplate', 'Session',
            '$location',
            function ($q, $http, UriTemplate, Session, $location) {
                return {
                    save: function (programResource) {
                        return $http.put(UriTemplate.create(programResource.link.self).stringify(),
                            programResource.entity).then(
                            function ok(response) {
                                return response.data;
                            });
                    },

                    /**
                     * Redirects to the proper user from the login
                     * @param scheduledProgramResource to create link from
                     * @returns {promise}
                     */
                    createUserLink: function (scheduledProgramResource) {
                        var deferred = $q.defer(),
                            user = scheduledProgramResource.entity.createdBy;
                        if (user) {
                            var current = $location.url(), link;
                            if (user.type === 'A') {
                                link = $location.path('/users/' + user.id).absUrl();
                            } else if (user.type === 'C') {
                                link = $location.path('/support/clients/' + user.client.id + '/users/' + user.id).absUrl();
                            }
                            // set link back to where we are now so current window doesn't change
                            $location.url(current);
                            deferred.resolve(link);
                        } else {
                            // no created by user on the resource
                            deferred.reject();
                        }
                        return deferred.promise;
                    }
                };
            }
        ])
    ;

})(window.angular);
