'use strict';

angular.module('emmiManager')
    .service('CreatePatientService', ['$http', 'API', '$q', 'UriTemplate',
        function ($http, API, $q, UriTemplate) {
            return {
                save: function (client, patient) {
                    var deferred = $q.defer();
                    $http.post(UriTemplate.create(client.link.patient).stringify(), patient).then(function (response) {
                        deferred.resolve(response);
                    });
                    return deferred.promise;
                },
                refData: function () {
                    return $http.get(UriTemplate.create(API.patientReferenceData).stringify()).then(function (response) {
                        return response.data.genders;
                    });
                },
                update: function (client, patient){
                    return $http.put(UriTemplate.create(client.link.patient).stringify(), patient).then(function (response){
                       console.log(response);
                        return response;
                    });
                }
            };
        }])
;
