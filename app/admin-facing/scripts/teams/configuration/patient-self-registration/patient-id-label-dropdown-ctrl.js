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
                $scope.patientSelfRegConfig.entity.patientIdLabelType = $scope.idLabelTypes[0];
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

                    angular.forEach(listOfIdLabelConfigs, function (config) {
                        PatientIdLabelDropDownService.update(config).then(function (response) {
                            $scope.updateLabels(response);
                        });
                    });

                } else if ($scope.originalIdLabelConfig === undefined) {
                    angular.forEach(listOfIdLabelConfigs, function (config) {
                        PatientIdLabelDropDownService.create(config, $scope.patientSelfRegConfig).then(function (response) {
                            $scope.updateLabels(response);
                        });
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

            $scope.updateLabels = function (config) {
                $scope.originalIdLabelConfig = $scope.patientSelfRegConfig.entity.patientIdLabelType;
                angular.forEach($scope.languagesAvailable, function (language) {
                    if (language.entity.languageTag === config.entity.language.languageTag && config.entity.language.languageTag === 'en') {
                        $scope.idLabelConfigEnglish.config = config;
                        $scope.originalIdLabelConfigEnglish = config;
                    } else if (language.entity.languageTag === config.entity.language.languageTag && config.entity.language.languageTag === 'es') {
                        $scope.idLabelConfigSpanish.config = config;
                        $scope.originalIdLabelConfigSpanish = config;
                    }
                });
            };
        }])
;
