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
                },
                loadAllScheduledPatients : function (team) {
                    var deferred = $q.defer();
                    var responseArray = [];
                    $http.get(UriTemplate.create(team.link.patientsScheduled).stringify()).then(function addToPatients(response) {
                        var page = response.data;
                        angular.forEach(response.data.content, function(patient){
                            responseArray.push(patient);
                        });
                        if (page.link && page.link['page-next']) {
                            $http.get(page.link['page-next']).then(function (response) {
                                addToPatients(response);
                            });
                        } else {
                            deferred.resolve(responseArray);
                        }
                    });
                    return deferred.promise;
                }
            };
        }])
;
