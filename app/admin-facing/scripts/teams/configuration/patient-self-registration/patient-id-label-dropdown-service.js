'use strict';

angular.module('emmiManager')
    .service('PatientIdLabelDropDownService', ['$http', 'API', 'UriTemplate', '$translate', '$q', 'CommonService',
        function ($http, API, UriTemplate, $translate, $q, CommonService) {
            return {
                getPatientIdLabelConfig: function (patientSelfRegConfig) {
                    return $http.get(UriTemplate.create(patientSelfRegConfig.link.patientIdLabelConfig).stringify())
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                translate: function (string) {
                    return $http.get(UriTemplate.create(API.translations).stringify({
                        key: string
                    })).then(function (response) {
                        return response.data;
                    });
                },
                create: function (configs, patientSelfRegConfig) {
                    var deferred = $q.defer();
                    var configsSaved = [];
                    angular.forEach(configs, function (patientIdLabelConfigToSave) {
                        patientIdLabelConfigToSave.patientSelfRegConfig = patientSelfRegConfig.entity;
                        $http.post(UriTemplate.create(patientSelfRegConfig.link.patientIdLabelConfig).stringify(), patientIdLabelConfigToSave.config.entity).then(function (response) {
                            configsSaved.push(response);
                            deferred.resolve(configsSaved);
                        });
                    });
                    return deferred.promise;
                },
                update: function (configs) {
                    var deferred = $q.defer();
                    var configsSaved = [];
                    angular.forEach(configs, function (patientIdLabelConfigToUpdate) {
                        $http.put(UriTemplate.create(patientIdLabelConfigToUpdate.config.link.self).stringify(), patientIdLabelConfigToUpdate.config.entity).then(function (response) {
                            configsSaved.push(response);
                            deferred.resolve(configsSaved);
                        });
                    });
                    return deferred.promise;
                }
            }
        }])
;
