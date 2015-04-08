'use strict';

angular.module('emmiManager')
    .service('ViewPatientService', ['$http', 'API', '$q', 'UriTemplate',
        function ($http, API, $q, UriTemplate) {
            return {
                loadPatient: function (clientResource, patientId) {
                    console.log(clientResource);
                    return $http.get(UriTemplate.create(clientResource.link.patientById).stringify({patientId: patientId}))
                        .success(function (response) {
                            console.log(response);
                            return response.data;
                        });
                }
            }
        }])
;
