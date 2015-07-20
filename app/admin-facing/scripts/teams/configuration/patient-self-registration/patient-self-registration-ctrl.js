'use strict';

angular.module('emmiManager')
    .controller('PatientSelfRegController', ['$scope', 'PatientSelfRegService', '$alert',
        function ($scope, PatientSelfRegService, $alert) {

            PatientSelfRegService.get($scope.team).then(function (response) {
                $scope.idLabelConfig = {};
                $scope.patientSelfRegConfig = response.entity;
                if ($scope.patientSelfRegConfig) {
                    $scope.loadAllConfigs(response);
                } else {
                    $scope.patientSelfRegConfig = {};
                    $scope.setDefaultPatientIdLabel();
                }
            });

            $scope.createPatientIdLabelConfig = function () {
                $scope.patientIdLabelConfigs = [];

                var languageObjectEnglish = {};
                languageObjectEnglish.languageTag = 'en';

                var languageObjectSpanish = {};
                languageObjectSpanish.languageTag = 'sp';

                var patientIdLabelEnglish = {};
                patientIdLabelEnglish.language = languageObjectEnglish;
                patientIdLabelEnglish.value = $scope.idLabelConfig.patientIdLabelEnglish;
                patientIdLabelEnglish.patientSelfRegConfig = $scope.patientSelfRegConfig;
                patientIdLabelEnglish.idLabelType = $scope.idLabelConfig.idLabelType;

                var patientIdLabelSpanish = {};
                patientIdLabelSpanish.language = languageObjectSpanish;
                patientIdLabelSpanish.value = $scope.idLabelConfig.patientIdLabelSpanish;
                patientIdLabelSpanish.patientSelfRegConfig = $scope.patientSelfRegConfig;
                patientIdLabelSpanish.idLabelType = $scope.idLabelConfig.idLabelType;

                $scope.patientIdLabelConfigs.push(patientIdLabelEnglish);
                $scope.patientIdLabelConfigs.push(patientIdLabelSpanish);
                return $scope.patientIdLabelConfigs;
            };

            $scope.loadAllConfigs = function (patientSelfRegConfig) {
                PatientSelfRegService.getPatientIdLabelConfig(patientSelfRegConfig).then(function (patientIdLabelConfigs) {
                    if (patientIdLabelConfigs === '') {
                        $scope.setDefaultPatientIdLabel();
                    }
                    angular.forEach(patientIdLabelConfigs.content, function (config) {
                        if (config.entity.language.languageTag === 'en') {
                            $scope.idLabelConfig.patientIdLabelEnglish = config.entity.value;
                            $scope.idLabelConfig.idLabelType = config.entity.idLabelType;
                        } else if (config.entity.language.languageTag === 'sp') {
                            $scope.idLabelConfig.patientIdLabelSpanish = config.entity.value;
                            $scope.idLabelConfig.idLabelType = config.entity.idLabelType;
                        }
                    });
                });
            };

            $scope.setDefaultPatientIdLabel = function () {
                $scope.idLabelConfig.idLabelType = 'PATIENT_SELF_REG_LABEL_PATIENT_ID';
                $scope.updatePatientIDLabelType($scope.idLabelConfig.idLabelType);
            };

            $scope.continue = function (form) {
                if (form.$valid) {
                    $scope.whenSaving = true;
                    if ($scope.patientSelfRegConfig && $scope.patientSelfRegConfig.id) {
                        $scope.update();
                    }
                    else {
                        $scope.create();
                    }
                }
            };

            $scope.create = function () {
                PatientSelfRegService.create($scope.team, $scope.patientSelfRegConfig, $scope.createPatientIdLabelConfig()).then(function (response) {
                    $scope.patientSelfRegConfig = response.entity;
                    $alert({
                        content: 'The patient self reg configuration has been saved successfully.'
                    });
                })
                    .finally(function () {
                        $scope.whenSaving = false;
                    });
            };

            $scope.update = function () {
                PatientSelfRegService.update($scope.team, $scope.patientSelfRegConfig, $scope.createPatientIdLabelConfig()).then(function (response) {
                    $scope.patientSelfRegConfig = response.entity;
                    $alert({
                        content: 'The team self reg configuration has been updated successfully.'
                    });
                })
                    .finally(function () {
                        $scope.whenSaving = false;
                    });
            };

            $scope.updatePatientIDLabelType = function (idLabelType) {
                PatientSelfRegService.translate(idLabelType, $scope.idLabelConfig);
            };

        }])
;
