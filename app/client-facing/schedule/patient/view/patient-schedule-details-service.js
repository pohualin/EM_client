'use strict';

angular.module('emmiManager')
    .service('PatientScheduleDetailsService', ['$http', 'UriTemplate',
        function ($http, UriTemplate) {
            return {
                getPatientScheduleDetails: function (team) {
                    return $http.get(UriTemplate.create(team.link.patientScheduleDetails).stringify({patientId: team.patient.entity.id}))
                        .success(function (response) {
                            return response.data;
                        });
                    }
                }
            }
        ])
;
