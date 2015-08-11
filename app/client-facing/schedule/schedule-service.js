'use strict';

angular.module('emmiManager')

    .service('ScheduleService', ['$http', '$q', 'UriTemplate', 'moment', 'ScheduledProgramFactory',
        function ($http, $q, UriTemplate, moment, ScheduledProgramFactory) {
            return {

                /**
                 * Loads the team from a client
                 *
                 * @param clientResource the client on which the team exists
                 * @param teamId to load
                 * @returns {*}
                 */
                loadTeam: function (clientResource, teamId) {
                    return $http.get(UriTemplate.create(clientResource.link.team).stringify({teamId: teamId}))
                        .success(function (response) {
                            return response.data;
                        });
                },

                /**
                 * Loads the scheduled program by id
                 *
                 * @param clientResource to get the team
                 * @param teamId
                 * @param scheduleId
                 * @returns {*} a promise
                 */
                loadSchedule: function (clientResource, teamId, scheduleId) {
                    var deferred = $q.defer();
                    $http.get(UriTemplate.create(clientResource.link.team).stringify({teamId: teamId}))
                        .success(function (teamResource) {
                            $http.get(UriTemplate.create(teamResource.link.scheduleById)
                                .stringify({
                                    clientId: clientResource.entity.id,
                                    teamId: teamId,
                                    scheduleId: scheduleId
                                }
                            )).then(function (response) {
                                deferred.resolve(response.data);
                            });
                        });
                    return deferred.promise;
                },

                /**
                 * Schedule the passed program
                 *
                 * @param teamResource to schedule it for
                 * @param toSchedule an instance of the ScheduledProgramFactory
                 * @returns {*} a promise
                 */
                schedule: function (teamResource, toSchedule) {
                    return $http.post(UriTemplate.create(teamResource.link.schedulePrograms).stringify(),
                        {
                            patient: {
                                id: toSchedule.patient.id
                            },
                            program: {
                                id: toSchedule.program.entity.id
                            },
                            team: {
                                id: teamResource.entity.id
                            },
                            location: {
                                // scheduledProgram.location is a TeamLocation
                                id: toSchedule.location.entity.location.id
                            },
                            provider: {
                                // scheduledProgram.provider is a TeamProvider
                                id: toSchedule.provider.entity.provider.id
                            },
                            viewByDate: moment(toSchedule.viewByDate).utc().format('YYYY-MM-DD')
                        }
                    );
                },
                /**
                 * Schedule one or more selected programs
                 * 
                 * @param teamResource to schedule it for
                 * @returns {*} a promise
                 */
                scheduleBulk: function (teamResource) {
                    var self = this;
                    var deferred = $q.defer();
                    var saveRequests = [];
                    
                    angular.forEach(ScheduledProgramFactory.selectedPrograms, function (selectedProgram) {
                        selectedProgram.patient = ScheduledProgramFactory.patient;
                        var deferred = $q.defer();
                        self.schedule(teamResource, selectedProgram).then(function(response){
                            deferred.resolve(response.data);
                        });
                        saveRequests.push(deferred.promise);
                    });

                    $q.all(saveRequests).then(function(response){
                        deferred.resolve(response);
                    });
                    return deferred.promise;
                }
            };
        }])
;
