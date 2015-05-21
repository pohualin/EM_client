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
                                id: toSchedule.scheduledProgram.program.entity.id
                            },
                            team: {
                                id: teamResource.entity.id
                            },
                            location: {
                                id: toSchedule.scheduledProgram.location.entity.id
                            },
                            provider: {
                                id: toSchedule.scheduledProgram.provider.entity.id
                            },
                            viewByDate: moment(toSchedule.scheduledProgram.viewByDate).utc().format('YYYY-MM-DD')
                        }
                    );
                }
            };
        }])
;
