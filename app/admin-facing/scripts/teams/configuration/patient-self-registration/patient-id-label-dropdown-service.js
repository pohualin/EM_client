'use strict';

angular.module('emmiManager')
    .service('PatientIdLabelDropDownService', ['$http', 'Session', 'UriTemplate', '$translate', '$q', 'CommonService',
        function ($http, Session, UriTemplate, $translate, $q, CommonService) {
            return {
                getPatientIdLabelConfig: function (patientSelfRegConfig) {
                    return $http.get(UriTemplate.create(patientSelfRegConfig.link.patientIdLabelConfig).stringify())
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                translate: function (string) {
                    return $http.get(UriTemplate.create(Session.link.translations).stringify({
                        key: string
                    })).then(function (response) {
                        return response.data;
                    });
                },
                create: function (patientIdLabelConfig, patientSelfRegConfig) {
                    patientIdLabelConfig.patientSelfRegConfig = patientSelfRegConfig.entity;
                    return $http.post(UriTemplate.create(patientSelfRegConfig.link.patientIdLabelConfig).stringify(), patientIdLabelConfig.config.entity).then(function (response) {
                        return response.data
                    });
                },
                update: function (patientIdLabelConfig) {
                    return $http.put(UriTemplate.create(patientIdLabelConfig.config.link.self).stringify(), patientIdLabelConfig.config.entity).then(function (response) {
                        return response.data;
                    });
                }
            }
        }])
;
