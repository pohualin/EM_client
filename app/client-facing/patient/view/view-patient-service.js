'use strict';

angular.module('emmiManager')
    .service('ViewPatientService', ['$http', 'API', '$q', 'UriTemplate',
        function ($http, API, $q, UriTemplate) {
            return {
                loadPatient: function (clientResource, patientId) {
                    return $http.get(UriTemplate.create(clientResource.link.patientById).stringify({patientId: patientId}))
                        .success(function (response) {
                            return response.data;
                        });
                }
            };
        }])
;
