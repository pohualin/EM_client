'use strict';

angular.module('emmiManager')
    .service('CreatePatientService', ['$http', 'API', '$q', 'UriTemplate',
        function ($http, API, $q, UriTemplate) {
            return {
                /**
                 * Saves the given patient
                 * @param client to save on the patient, has the href for patient save
                 * @param patient to save
                 * @returns {*}
                 */
                save: function (client, patient) {
                    var deferred = $q.defer();
                    $http.post(UriTemplate.create(client.link.patient).stringify(), patient).then(function (response) {
                        deferred.resolve(response);
                    });
                    return deferred.promise;
                },
                /**
                 * Loads the reference data for Genders for Patient
                 * @returns {*}
                 */
                refData: function () {
                    return $http.get(UriTemplate.create(API.patientReferenceData).stringify()).then(function (response) {
                        return response.data.genders;
                    });
                },
                /**
                 * Updates the given patient
                 * @param client for href
                 * @param patient to update
                 * @returns {*}
                 */
                update: function (client, patient){
                    return $http.put(UriTemplate.create(client.link.patient).stringify(), patient).then(function (response){
                       console.log(response);
                        return response;
                    });
                }
            };
        }])
;
