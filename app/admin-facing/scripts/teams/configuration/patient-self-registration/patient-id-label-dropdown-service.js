'use strict';

angular.module('emmiManager')
    .service('PatientIdLabelDropDownService', ['$http', 'Session', 'UriTemplate', '$translate', '$q', 'CommonService',
        function ($http, Session, UriTemplate, $translate, $q, CommonService) {
            return {
                /**
                 * GET to find patient id label config for a given patient self reg configuration
                 * @param patientSelfRegConfig
                 * @returns {*}
                 */
                getPatientIdLabelConfig: function (patientSelfRegConfig) {
                    return $http.get(UriTemplate.create(patientSelfRegConfig.link.patientIdLabelConfig).stringify())
                        .then(function (response) {
                            CommonService.convertPageContentLinks(response.data);
                            return response.data;
                        });
                },
                /**
                 * GET for translations for a given key_path from Strings
                 * @param string
                 * @returns {*}
                 */
                translate: function (string) {
                    return $http.get(UriTemplate.create(Session.link.translations).stringify({
                        key: string
                    })).then(function (response) {
                        return response.data;
                    });
                },
                /**
                 * Creates a new patient id label config for a given patient self reg config
                 * @param patientIdLabelConfig
                 * @param patientSelfRegConfig
                 * @returns {*}
                 */
                create: function (patientIdLabelConfig, patientSelfRegConfig) {
                    patientIdLabelConfig.patientSelfRegConfig = patientSelfRegConfig.entity;
                    return $http.post(UriTemplate.create(patientSelfRegConfig.link.patientIdLabelConfig).stringify(), patientIdLabelConfig.config.entity).then(function (response) {
                        return response.data
                    });
                },
                /**
                 * Updates a given patient id label config for a given patient self reg config
                 * @param patientIdLabelConfig
                 * @returns {*}
                 */
                update: function (patientIdLabelConfig) {
                    return $http.put(UriTemplate.create(patientIdLabelConfig.config.link.self).stringify(), patientIdLabelConfig.config.entity).then(function (response) {
                        return response.data;
                    });
                }
            }
        }])
;
