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

                $scope.idLabelConfigEnglish = $scope.idLabelConfigEnglish ? $scope.idLabelConfigEnglish : {};
                $scope.idLabelConfigEnglish.patientSelfRegConfig = $scope.patientSelfRegConfig;
                $scope.idLabelConfigEnglish.idLabelType = $scope.idLabelConfig.idLabelType;


                $scope.idLabelConfigSpanish = $scope.idLabelConfigSpanish ? $scope.idLabelConfigSpanish : {};
                $scope.idLabelConfigSpanish.patientSelfRegConfig = $scope.patientSelfRegConfig;
                $scope.idLabelConfigSpanish.idLabelType = $scope.idLabelConfig.idLabelType;

                angular.forEach($scope.languagesAvailable, function (language) {
                    if (language.entity.languageTag === 'en') {
                        $scope.idLabelConfigEnglish.language = language.entity;
                        //console.log($scope.idLabelConfigEnglish);
                    }
                    else if (language.entity.languageTag === 'es') {
                        $scope.idLabelConfigSpanish.language = language.entity;
                        //console.log($scope.idLabelConfigSpanish);
                    }
                });

                $scope.patientIdLabelConfigs.push($scope.idLabelConfigSpanish);
                $scope.patientIdLabelConfigs.push($scope.idLabelConfigEnglish);
                return $scope.patientIdLabelConfigs;
            };

            $scope.loadAllConfigs = function (patientSelfRegConfig) {
                PatientSelfRegService.getPatientIdLabelConfig(patientSelfRegConfig).then(function (patientIdLabelConfigs) {
                    if (patientIdLabelConfigs === '') {
                        $scope.setDefaultPatientIdLabel();
                    }
                    angular.forEach(patientIdLabelConfigs.content, function (config) {
                        angular.forEach($scope.languagesAvailable, function (language) {
                            if (language.entity.languageTag === config.entity.language.languageTag && config.entity.language.languageTag === 'en') {
                                $scope.idLabelConfigEnglish = config.entity;
                            } else if (language.entity.languageTag === config.entity.language.languageTag && config.entity.language.languageTag === 'es') {
                                $scope.idLabelConfigSpanish = config.entity;
                            }
                        });

                    });
                });
            };

                $scope.lister = function (list){
                console.log(list);
                angular.forEach(list, function (config) {
                    angular.forEach($scope.languagesAvailable, function (language) {
                        if (language.entity.languageTag === config.entity.language.languageTag && config.entity.language.languageTag === 'en') {
                            $scope.idLabelConfigEnglish = config.entity;
                        } else if (language.entity.languageTag === config.entity.language.languageTag && config.entity.language.languageTag === 'es') {
                            $scope.idLabelConfigSpanish = config.entity;
                        }
                    });

                });
            }

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
                    console.log($scope.patientSelfRegConfig);
                    $scope.lister($scope.patientSelfRegConfig.patientIdLabelConfigs);
                    $alert({
                        content: 'The team self reg configuration has been updated successfully.'
                    });
                })
                    .finally(function () {
                        $scope.whenSaving = false;
                    });
            };

            /*$scope.setDefaultPatientIdLabel = function () {
                $scope.idLabelConfig.idLabelType = 'PATIENT_SELF_REG_LABEL_PATIENT_ID';
                $scope.updatePatientIDLabelType($scope.idLabelConfig.idLabelType);
            };

            $scope.updatePatientIDLabelType = function (idLabelType) {
                PatientSelfRegService.translate(idLabelType, $scope.idLabelConfig);
            };*/

        }])
;
