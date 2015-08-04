'use strict';

angular.module('emmiManager')
    .controller('PatientIdLabelDropDownController', ['$scope', 'PatientSelfRegService', '$alert', 'PatientIdLabelDropDownService', '$controller',
        function ($scope, PatientSelfRegService, $alert, PatientIdLabelDropDownService, $controller) {

            PatientSelfRegService.get($scope.team).then(function (response) {
                $scope.patientSelfRegConfig = response;
                if ($scope.patientSelfRegConfig) {
                    $scope.originalIdLabelConfig = $scope.patientSelfRegConfig.entity.patientIdLabelType;
                    if ($scope.patientSelfRegConfig.entity.patientIdLabelType) {
                        $scope.loadAllConfigs();
                    } else {
                        $scope.setDefaultIdLabel();
                    }
                } else {
                    $scope.patientSelfRegConfig = {};
                    $scope.patientSelfRegConfig.entity = {};
                    $scope.setDefaultIdLabel();
                }
            });

            $scope.setDefaultIdLabel = function () {
                $scope.patientSelfRegConfig.entity.patientIdLabelType = {
                    "id": 1,
                    "typeKey": "PATIENT_SELF_REG_LABEL_PATIENT_ID",
                    "isModifiable": false
                };
                $scope.updatePatientIDLabelTypeTranslations($scope.patientSelfRegConfig.entity.patientIdLabelType);
            };

            $scope.createOrUpdateIdLabelConfig = function () {
                var listOfIdLabelConfigs = [];
                listOfIdLabelConfigs.push($scope.idLabelConfigEnglish);
                listOfIdLabelConfigs.push($scope.idLabelConfigSpanish);
                if ($scope.patientSelfRegConfig.entity.patientIdLabelType &&
                    $scope.patientSelfRegConfig.entity.patientIdLabelType.id &&
                    $scope.idLabelConfigEnglish.config.entity.id && $scope.originalIdLabelConfig &&
                    (!angular.equals($scope.originalIdLabelConfig, $scope.patientSelfRegConfig.entity.patientIdLabelType)
                    || !angular.equals($scope.originalIdLabelConfigEnglish, $scope.idLabelConfigEnglish.config)
                    || !angular.equals($scope.originalIdLabelConfigSpanish, $scope.idLabelConfigSpanish.config))) {
                    PatientIdLabelDropDownService.update(listOfIdLabelConfigs, $scope.patientSelfRegConfig).then(function (response) {

                        $scope.lister(response);
                    });
                } else if ($scope.originalIdLabelConfig === undefined) {
                    PatientIdLabelDropDownService.create(listOfIdLabelConfigs, $scope.patientSelfRegConfig).then(function (response) {
                        $scope.lister(response);
                    });
                }
            };

            $scope.loadAllConfigs = function () {
                PatientIdLabelDropDownService.getPatientIdLabelConfig($scope.patientSelfRegConfig).then(function (response) {
                    angular.forEach(response.content, function (config) {
                        angular.forEach($scope.languagesAvailable, function (language) {
                            if (language.entity.languageTag === config.entity.language.languageTag && config.entity.language.languageTag === 'en') {
                                $scope.idLabelConfigEnglish.config = config;
                                $scope.originalIdLabelConfigEnglish = config;
                            } else if (language.entity.languageTag === config.entity.language.languageTag && config.entity.language.languageTag === 'es') {
                                $scope.idLabelConfigSpanish.config = config;
                                $scope.originalIdLabelConfigSpanish = config;
                            }
                        });
                    });
                });
            };

            $scope.lister = function (list) {
                $scope.originalIdLabelConfig = $scope.patientSelfRegConfig.entity.patientIdLabelType;
                angular.forEach(list, function (config) {
                    angular.forEach($scope.languagesAvailable, function (language) {
                        if (language.entity.languageTag === config.data.entity.language.languageTag && config.data.entity.language.languageTag === 'en') {
                            $scope.idLabelConfigEnglish.config = config.data;
                            $scope.originalIdLabelConfigEnglish = config.data;
                        } else if (language.entity.languageTag === config.data.entity.language.languageTag && config.data.entity.language.languageTag === 'es') {
                            $scope.idLabelConfigSpanish.config = config.data;
                            $scope.originalIdLabelConfigSpanish = config.data;
                        }
                    });
                });
            };
        }])
;
