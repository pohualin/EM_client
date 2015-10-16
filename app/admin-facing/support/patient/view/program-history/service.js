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

                    getPatientNotes: function(scheduledProgramResource) {
                        return $http.get(UriTemplate.create(scheduledProgramResource.link.programNotes).stringify()).then(
                            function ok(response) {
                                /* TODO: Check for scenario where response is ok but no notes exist. Will update once microservice is created. */
                                return response.data;
                            }, function error(response) {
                                return 'This program has no notes or questions.';
                            });
                    },

                    /**
                     * Redirects to the proper user from the login
                     * @param encounterResource to create link from
                     * @returns {promise}
                     */
                    createUserLink: function (encounterResource) {
                        var deferred = $q.defer(),
                            user = encounterResource.entity.createdBy;
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
