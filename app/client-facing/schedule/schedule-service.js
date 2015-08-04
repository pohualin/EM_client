'use strict';

angular.module('emmiManager')

    .service('ScheduleService', ['$http', '$q', 'UriTemplate', 'moment', 'ScheduledProgramFactory', 
        function ($http, $q, UriTemplate, moment, ScheduledProgramFactory ) {
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
                 * Create a schedule object 
                 */
                toBeSchedule: function (teamResource, toSchedule) {
                	return {
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
                			// scheduledProgram.location is a TeamLocation
                			id: toSchedule.scheduledProgram.location.entity.location.id 
                		},
                		provider: {
                			// scheduledProgram.provider is a TeamProvider
                			id: toSchedule.scheduledProgram.provider.entity.provider.id
                		},
                		viewByDate: moment(toSchedule.scheduledProgram.viewByDate).utc().format('YYYY-MM-DD')
                	};
                },
                /**
                 * Create a schedule object with no provider 
                 * when the team scheduling configuration use provider off
                 */
                toBeScheduleNoProvider: function (teamResource, toSchedule){
                	return {
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
                			// scheduledProgram.location is a TeamLocation
                			id: toSchedule.scheduledProgram.location.entity.location.id 
                		},
                		viewByDate: moment(toSchedule.scheduledProgram.viewByDate).utc().format('YYYY-MM-DD')
                	};
                },
                /**
                 * Create a schedule object with no location
                 * when the team scheduling configuration use location off
                 */
                toBeScheduleNoLocation: function (teamResource, toSchedule){
                	return {
                		patient: {
                			id: toSchedule.patient.id
                		},
                		program: {
                			id: toSchedule.scheduledProgram.program.entity.id
                		},
                		team: {
                			id: teamResource.entity.id
                		},
                		provider: {
                			// scheduledProgram.provider is a TeamProvider
                			id: toSchedule.scheduledProgram.provider.entity.provider.id
                		},
                		viewByDate: moment(toSchedule.scheduledProgram.viewByDate).utc().format('YYYY-MM-DD')
                	};
                },
                /**
                 * Create a schedule object with no provider and no location 
                 * when the team scheduling configuration use provider off and use location off
                 */ 
                toBeScheduleNoLocationNoProvider: function (teamResource, toSchedule){
                	return {
                		patient: {
                			id: toSchedule.patient.id
                		},
                		program: {
                			id: toSchedule.scheduledProgram.program.entity.id
                		},
                		team: {
                			id: teamResource.entity.id
                		},
                		viewByDate: moment(toSchedule.scheduledProgram.viewByDate).utc().format('YYYY-MM-DD')
                	};
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
                	var toBeSchedule = {};
                	if((!toSchedule.useLocation) &&
                		(!toSchedule.useProvider)){
                		toBeSchedule = this.toBeScheduleNoLocationNoProvider(teamResource, toSchedule);
                	}
                	else if(!toSchedule.useLocation){
                		toBeSchedule = this.toBeScheduleNoLocation(teamResource, toSchedule);
                	}
                	else if(!toSchedule.useProvider){
                		toBeSchedule = this.toBeScheduleNoProvider(teamResource, toSchedule);
                	}
                	else{
                		toBeSchedule = this.toBeSchedule(teamResource, toSchedule);
                	}
                	return $http.post(UriTemplate.create(teamResource.link.schedulePrograms).stringify(),
                    		toBeSchedule
                    );
                }
            };
        }])
;
