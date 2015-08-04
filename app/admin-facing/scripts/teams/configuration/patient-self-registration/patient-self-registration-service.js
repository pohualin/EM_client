'use strict';

angular.module('emmiManager')
    .service('PatientSelfRegService', ['$http', 'API', 'UriTemplate', '$translate', '$q', function ($http, API, UriTemplate, $translate, $q) {
        return {
            /**
             * gets a patient self-reg configuration for the team
             * @param team
             * @returns {*}
             */
            get: function (team) {
                return $http.get(UriTemplate.create(team.link.patientSelfRegConfig).stringify())
                    .then(function (response) {
                        return response.data;
                    });
            },
            /**
             * creates a new patient self-reg configuration for a given team
             * @param team
             * @param config
             * @returns {*}
             */
            create: function (team, config) {
                var deferred = $q.defer();
                config.exposeName = true;
                config.requireDateOfBirth = true;
                $http.post(UriTemplate.create(team.link.patientSelfRegConfig).stringify(), config.entity)
                    .then(function (response) {
                        var patientSelfRegConfig = response.data;
                        if (patientSelfRegConfig) {
                            deferred.resolve(patientSelfRegConfig);
                        } else {
                            deferred.reject();
                        }
                    });
                return deferred.promise;
            },
            /**
             * updates a given patient self-reg configuration for a given team
             * @param team
             * @param config
             * @returns {*}
             */
            update: function (team, config) {
                var deferred = $q.defer();
                $http.put(UriTemplate.create(team.link.patientSelfRegConfig).stringify(), config.entity)
                    .then(function (response) {
                        var patientSelfRegConfig = response.data;
                        if (patientSelfRegConfig) {
                            deferred.resolve(patientSelfRegConfig);
                        } else {
                            deferred.reject();
                        }
                    });
                return deferred.promise;
            },
            /**
             * loads the reference data for patient ID label type for a patient self-reg configuration
             * @returns {*}
             */
            refData: function () {
                return $http.get(UriTemplate.create(API.patientSelfRegReferenceData).stringify()).then(function (response) {
                    return response.data.idLabelTypes;
                });
            }
        }
    }])
;
