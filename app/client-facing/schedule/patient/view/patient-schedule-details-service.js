'use strict';

angular.module('emmiManager')
    .factory('PatientScheduleDetailsService', ['$http', 'UriTemplate', '$q',
        function ($http, UriTemplate, $q) {
            var PatientScheduleDetailsService = {};
            var _encounters = null;

            PatientScheduleDetailsService.getPatientScheduleDetails = function(team) {
                var deferred = $q.defer();
                var responseArray = [];

                $http.get(UriTemplate.create(team.link.patientScheduleDetails).stringify({patientId: team.patient.entity.id})).then(function addToSchedules(response) {
                    var page = response.data;

                    angular.forEach(response.data.content, function(schedule){
                        responseArray.push(schedule);
                    });

                    if (page.link && page.link['page-next']) {
                        $http.get(page.link['page-next']).then(function (response) {
                            addToSchedules(response);
                        });
                    } else {
                        deferred.resolve(responseArray);
                    }
                });

                return deferred.promise;
            };

            PatientScheduleDetailsService.updateEncounters = function(teamResource) {
                var deferred = $q.defer();
                var encounters = [];

                PatientScheduleDetailsService.getPatientScheduleDetails(teamResource).then(function(scheduledPrograms) {
                    var map = {};

                    angular.forEach(scheduledPrograms, function(scheduledProgram) {
                        var encounter = scheduledProgram.entity.encounter;
                        delete scheduledProgram.entity.encounter;

                        if (!map[encounter.id]) {
                            var encounterResource = { entity: encounter };
                            encounterResource.scheduledProgramsMap = {};
                            map[encounter.id] = encounterResource;
                        }

                        map[encounter.id].scheduledProgramsMap[scheduledProgram.entity.id] = scheduledProgram;
                    });

                    angular.forEach(map, function (encounter) {
                        var programNames = [];
                        var accessCodeLatest = { code: '', date: ''};
                        encounter.entity.scheduledPrograms = [];

                        angular.forEach(encounter.scheduledProgramsMap, function (scheduledProgram) {
                            encounter.entity.scheduledPrograms.push(scheduledProgram);
                            programNames.push(scheduledProgram.entity.program.name);

                            // We want to display the furthest scheduled program's access code in the encounter display
                            if ((accessCodeLatest.date === '') || (Date.parse(scheduledProgram.entity.viewByDate) > Date.parse(accessCodeLatest.date))) {
                                accessCodeLatest.code = scheduledProgram.entity.accessCode;
                                accessCodeLatest.date = scheduledProgram.entity.viewByDate;
                            }
                        });

                        delete encounter.scheduledProgramsMap;

                        // Set accessCode, createdBy and team from first scheduled program
                        encounter.entity.accessCode = accessCodeLatest.code;
                        encounter.entity.createdBy = encounter.entity.scheduledPrograms[0].entity.createdBy;
                        encounter.entity.team = encounter.entity.scheduledPrograms[0].entity.team;
                        encounter.entity.names = programNames.join('; ');
                        encounters.push(encounter);
                    });

                    _encounters = encounters;
                    deferred.resolve(encounters);

                    return _encounters;
                });

                return deferred.promise;
            };

            PatientScheduleDetailsService.setEncounters = function(encounters) {
                _encounters = encounters;
                return this;
            };

            PatientScheduleDetailsService.getEncounters = function() {
                return _encounters;
            };

            return PatientScheduleDetailsService;

        }
    ])
;
