'use strict';

angular.module('emmiManager')
    .service('PatientScheduleDetailsService', ['$http', 'UriTemplate',
        function ($http, UriTemplate) {
            return {
                getPatientScheduleDetails: function (patient) {
                    return $http.get(UriTemplate.create(patient.link.scheduledPrograms).stringify({patientId: patient.entity.id}))
                        .success(function (response) {
                            return response.data;
                        });
                    }
                }
            }
        ])
;
