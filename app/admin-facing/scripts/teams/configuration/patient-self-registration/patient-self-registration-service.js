'use strict';

angular.module('emmiManager')
    .service('PatientSelfRegService', ['$http', 'API', 'UriTemplate', '$translate', '$q', function($http, API, UriTemplate, $translate, $q){
        return{
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
                return $http.post(UriTemplate.create(team.link.patientSelfRegConfig).stringify(), config)
                    .success(function (response) {
                        return response.data;
                    });
            },
            /**
             * updates a given patient self-reg configuration for a given team
             * @param team
             * @param config
             * @returns {*}
             */
            update: function (team, config) {
                return $http.put(UriTemplate.create(team.link.patientSelfRegConfig).stringify(), config)
                    .success(function (response) {
                        return response.data;
                    });
            },
            /**
             * loads the reference data for patient ID label type for a patient self-reg configuration
             * @param team
             * @returns {*}
             */
            refData: function (team) {
                return $http.get(UriTemplate.create(API.patientSelfRegReferenceData).stringify()).then(function (response) {
                    return response.data.idLabelTypes;
                });
            },
            translate: function(idLabelType, config){
                if (idLabelType === 'OTHER_ID_LABEL') {
                    config.patientIdLabelSpanish = '';
                    config.patientIdLabelEnglish = '';
                } else {
                    var promises = [];
                    promises.push($translate(idLabelType + '_SPANISH'));
                    promises.push($translate(idLabelType));
                    return $q.all(promises).then(function (response) {
                        config.patientIdLabelSpanish = response[0];
                        config.patientIdLabelEnglish = response [1];
                    });
                }
                ;
            }
        }
    }])
;
