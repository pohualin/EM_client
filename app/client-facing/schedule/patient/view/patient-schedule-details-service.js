'use strict';

angular.module('emmiManager')
    .service('PatientScheduleDetailsService', ['$http', 'UriTemplate', '$q',
        function ($http, UriTemplate, $q) {
            return {
                getPatientScheduleDetails: function (team) {
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
                    }
                };
            }
        ])
;
