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
                 * Loads scheduled program with the encounter id
                 * 
                 * @param clientResource to get the team
                 * @param teamId
                 * @param encounterId
                 * @param sortBy
                 * @return a promise
                 */
                loadEncounter: function (clientResource, teamId, encounterId, sortBy) {
                    var deferred = $q.defer();
                    $http.get(UriTemplate.create(clientResource.link.team).stringify({teamId: teamId}))
                        .success(function (teamResource) {
                            $http.get(UriTemplate.create(teamResource.link.schedulePrograms)
                                .stringify({
                                    clientId: clientResource.entity.id,
                                    teamId: teamId,
                                    encounter: encounterId,
                                    sort: sortBy
                                }
                            )).then(function (response) {
                                deferred.resolve(response.data);
                            });
                        });
                    return deferred.promise;
                },
                
                /**
                 * Load the team configuration for a given team
                 * 
                 * @param team to load for
                 */
                loadTeamSchedulingConfiguration: function (team) {
                    return $http.get(UriTemplate.create(team.link.teamSchedulingConfig).stringify())
                        .then(function (response) {
                            return response.data;
                        });
                },

                /**
                 * Schedule the passed program
                 *
                 * @param toSchedule an instance of the ScheduledProgramFactory
                 * @returns {*} a promise
                 */
                schedule: function (teamResource, selectedProgram) {
                    return $http.post(UriTemplate.create(teamResource.link.schedulePrograms).stringify(),
                    {
                           patient: {
                                   id: selectedProgram.patient.id
                           },
                           program: {
                                   id: selectedProgram.program.entity.id
                           },
                           team: {
                                  id: teamResource.entity.id
                           },
                           location: {
                                  // selectedProgram.location is a TeamLocation
                                 id: selectedProgram.location ? selectedProgram.location.entity.location.id : ''
                           },
                           provider: {
                                 // selectedProgram.provider is a TeamProvider
                                 id: selectedProgram.provider ? selectedProgram.provider.entity.provider.id : ''
                           },
                           encounter: selectedProgram.encounter ? selectedProgram.encounter : null, 
                           viewByDate: moment(selectedProgram.viewByDate).utc().format('YYYY-MM-DD')
                    });
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
                    
                    var selectedPrograms = angular.copy(ScheduledProgramFactory.selectedPrograms);
                    var firstProgramDeferred = $q.defer();
                    var firstProgram = ScheduledProgramFactory.selectedPrograms[0];
                    firstProgram.patient = ScheduledProgramFactory.patient;
                    self.schedule(teamResource, firstProgram).then(function(response){
                        firstProgramDeferred.resolve(response.data);
                        selectedPrograms.shift();
                        angular.forEach(selectedPrograms, function (selectedProgram) {
                            selectedProgram.patient = ScheduledProgramFactory.patient;
                            selectedProgram.encounter = response.data.entity.encounter;
                            var deferred = $q.defer();
                            self.schedule(teamResource, selectedProgram).then(function(response){
                                deferred.resolve(response.data);
                            });
                            saveRequests.push(deferred.promise);
                        });
                    });
                    saveRequests.push(firstProgramDeferred.promise);

                    $q.all(saveRequests).then(function(response){
                        deferred.resolve(response);
                    });
                    return deferred.promise;
                }
            };
        }])
;
