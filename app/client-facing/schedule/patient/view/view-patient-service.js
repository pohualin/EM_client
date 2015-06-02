'use strict';

angular.module('emmiManager')
    .service('ViewPatientService', ['$http', 'API', '$q', 'UriTemplate',
        function ($http, API, $q, UriTemplate) {
            return {
                loadPatient: function (team, patientId) {
                    return $http.get(UriTemplate.create(team.link.patientById).stringify({patientId: patientId}))
                        .success(function (response) {
                            return response.data;
                        });
                }
            };
        }])
;
