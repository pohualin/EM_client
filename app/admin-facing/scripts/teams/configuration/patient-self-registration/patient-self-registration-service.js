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
            create: function (team, config, patientIdLabelConfigs) {
                var deferred = $q.defer();
                config.exposeName = true;
                config.requireDateOfBirth = true;
                $http.post(UriTemplate.create(team.link.patientSelfRegConfig).stringify(), config)
                    .then(function (response) {
                        var patientSelfRegConfig = response.data;
                        angular.forEach(patientIdLabelConfigs, function (patientIdLabelConfigToSave) {
                            patientIdLabelConfigToSave.patientSelfRegConfig = patientSelfRegConfig.entity;
                            return $http.post(UriTemplate.create(patientSelfRegConfig.link.patientIdLabelConfig).stringify(), patientIdLabelConfigToSave).then(function (headers) {
                                //console.log(headers);
                                patientSelfRegConfig.patientIdLabelConfigs = headers;
                            });
                        });
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
            update: function (team, config, patientIdLabelConfigs) {
                console.log(patientIdLabelConfigs);
                var deferred = $q.defer();
                $http.put(UriTemplate.create(team.link.patientSelfRegConfig).stringify(), config)
                    .then(function (response) {
                        var patientSelfRegConfig = response.data;
                        console.log(patientSelfRegConfig);
                        angular.forEach(patientIdLabelConfigs, function (patientIdLabelConfigToSave) {
                            console.log(patientSelfRegConfig.entity);
                            patientIdLabelConfigToSave.patientSelfRegConfig = patientSelfRegConfig.entity;
                            console.log(patientIdLabelConfigToSave);
                            if(patientIdLabelConfigToSave.id)
                            return $http.put(UriTemplate.create(patientSelfRegConfig.link.patientIdLabelConfig).stringify(), patientIdLabelConfigToSave).then(function (headers) {
                                //console.log(headers);
                                patientSelfRegConfig.entity.patientIdLabelConfigs = headers;
                            }); else {
                                return $http.post(UriTemplate.create(patientSelfRegConfig.link.patientIdLabelConfig).stringify(), patientIdLabelConfigToSave).then(function (headers) {
                                    //console.log(headers);
                                    patientSelfRegConfig.entity.patientIdLabelConfigs = headers;
                                });
                            }
                        });
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
                console.log(API);
                return $http.get(UriTemplate.create(API.patientSelfRegReferenceData).stringify()).then(function (response) {
                    return response.data.idLabelTypes;
                });
            },
            getPatientIdLabelConfig: function (patientSelfRegConfig) {
                return $http.get(UriTemplate.create(patientSelfRegConfig.link.patientIdLabelConfig).stringify())
                    .then(function (response) {
                        return response.data;
                    });
            }
        }
    }])
;
