'use strict';

angular.module('emmiManager')
    .controller('PatientIdLabelDropDownController', ['$scope', 'PatientSelfRegService', '$alert', 'PatientIdLabelDropDownService', '$controller',
        function ($scope, PatientSelfRegService, $alert, PatientIdLabelDropDownService, $controller) {

            /**
             * GET to find patient self reg config for a given team.
             * Loads patient id label config if patient self reg config is present,
             * else sets default value Patient Id in the dropdown for idLabelType
             */
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

            /**
             * Sets default label to be Patient Id and grabs it's translations
             */
            $scope.setDefaultIdLabel = function () {
                $scope.patientSelfRegConfig.entity.patientIdLabelType = $scope.idLabelTypes[0];
                $scope.updatePatientIDLabelTypeTranslations($scope.patientSelfRegConfig.entity.patientIdLabelType);
            };

            /**
             * creates a new patient id label config if one doesnt exist on the given patient self reg config, or
             * updates a given patient id label config
             */
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

            /**
             * Loads all patient id label configs for a given patient self reg config
             * according to the language
             */
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

            /**
             * updates idLabelConfigEnglish and idLabelConfigSpanish for created/updated patient id self reg config
             * @param config
             */
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
